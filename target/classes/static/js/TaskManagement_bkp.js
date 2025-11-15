document.addEventListener("DOMContentLoaded", function() {

	fetchAllData();

	const viewAllBtn = document.getElementById('viewAllTasks');
	if (viewAllBtn) {
		viewAllBtn.addEventListener('click', function(event) {
			event.preventDefault(); // Only if it's a link
			fetchAllData();         // Re-fetch the task list on demand
		});
	}

	// Attach click handler
	const addNewTaskLink = document.getElementById('addNewTaskLink');
	if (addNewTaskLink) {
		addNewTaskLink.addEventListener('click', function(event) {
			event.preventDefault();
			openTaskModal('create');
		});
	} else {
		console.warn("Add New Task link not found.");
	}
});


// Function to open the task modal
function openTaskModal(mode, task = null) {
	const modalLabel = document.getElementById('editTaskModalLabel');
	const modalsubmit = document.getElementById('modalsubmit');
	const updateForm = document.getElementById('UpdateTask');

	const taskInput = document.getElementById('name');
	const taskassignee = document.getElementById('assignee');
	const taskIdInput = document.getElementById('Id');
	const taskDescriptionInput = document.getElementById('description');
	const taskduedate = document.getElementById('duedate');
	const taskStatusInput = document.getElementById('status');

	if (mode === 'create') {
		modalLabel.innerText = 'Add New Task';
		modalsubmit.innerText = 'Create Task';
		updateForm.setAttribute('data-mode', 'create');
		taskInput.value = ''; // Clear input for creating a new task
		taskassignee.value = ''; 
		taskIdInput.value = ''; // Clear task ID for new task
		taskDescriptionInput.value = ''; // Clear description for new task
		taskduedate.value = ''; 
		taskStatusInput.value = 'false'; // Default status to "Not Completed"

	} else if (mode === 'edit' && task) {
		modalLabel.innerText = 'Edit Task';
		modalsubmit.innerText = 'Update Task';
		updateForm.setAttribute('data-mode', 'edit');
		taskIdInput.value = task.id; 
		taskIdInput.readOnly = true;
		taskassignee.value = task.assignee; 
		taskInput.value = task.name; 
		taskDescriptionInput.value = task.description; 
		taskduedate.value = task.duedate; 
		taskStatusInput.value = task.status; 
	}

	// Show the modal (Bootstrap 5 way)
	const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
	taskModal.show();
}




async function CreateUpdateTask(event) {
	event.preventDefault(); // Prevent default form submission

	const updateForm = document.getElementById('UpdateTask');
	if (!updateForm) {
		console.warn('UpdateTask form not found in the DOM.');
		return;
	}

	const mode = updateForm.getAttribute('data-mode');
	const updatedTask = {
		id: document.getElementById('Id').value,
		assignee: document.getElementById('assignee').value,
		name: document.getElementById('name').value,
		description: document.getElementById('description').value,
		duedate: document.getElementById('duedate').value,
		status: document.getElementById('status').value
	};

	let url = '';
	let method = '';

	if (mode === 'create') {
		url = '/api/tasks/createTask';
		method = 'POST';
	} else if (mode === 'edit') {
		url = `/api/tasks/${updatedTask.id}`;
		method = 'PUT';
	} else {
		console.error('Unknown form mode:', mode);
		return;
	}

	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: mode === 'create' ? JSON.stringify([updatedTask]) : JSON.stringify(updatedTask)
		});

		const responseData = await response.json(); // <-- Always parse as JSON

		if (response.ok) {
			console.log("Server Response:", responseData); // Good to see the real server response
			alert("Task updated successfully!");
			const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
			modal.hide();
			location.reload();
		} else {
			console.error("Server responded with an error:", responseData);
			alert("Failed to update task: " + (responseData.message || "Unknown error"));
		}
	} catch (error) {
		console.error("Error during fetch:", error);
		alert("Something went wrong while updating the task.");
	}
}
function fetchAllData() {
	fetch('/api/tasks')
		.then(response => response.json())
		.then(data => {
			const tableBody = document.getElementById('taskTableBody');
			
				// Destroy DataTable if it exists
			if ($.fn.DataTable.isDataTable('#TaskData')) {
				$('#TaskData').DataTable().clear().destroy();
			}

			tableBody.innerHTML = ''; // Clear old data before inserting new rows

			data.forEach(task => {
				const row = document.createElement('tr');

				const idCell = document.createElement('td');
				idCell.textContent = task.id;

				const assigneeCell = document.createElement('td');
				assigneeCell.textContent = task.assignee;

				const titleCell = document.createElement('td');
				titleCell.textContent = task.name;

				const descCell = document.createElement('td');
				descCell.textContent = task.description;

				const duedateCell = document.createElement('td');
				duedateCell.textContent = task.duedate;

				const comCell = document.createElement('td');
				const statusval = task.status;
				const statusSpan = document.createElement('span');
				statusSpan.textContent = statusval;
				//comCell.textContent =statusval ;
				if (statusval === "Completed") {
					statusSpan.style.backgroundColor = "green";
					statusSpan.style.color = "White";
				} else if (statusval === "OverDue") {
					statusSpan.style.backgroundColor = "red";
					statusSpan.style.color = "White";
				} else {
					statusSpan.style.backgroundColor = "orange";
					statusSpan.style.color = "black";
				}
				statusSpan.style.padding = "2px 4px";        
				statusSpan.style.borderRadius = "12px";
				
				comCell.appendChild(statusSpan);
				comCell.style.alignItems="center";
				

				const modifyorDeleteCell = document.createElement('td');

				const editIcon = document.createElement('i');
				editIcon.className = 'fas fa-edit';
				editIcon.title = 'Edit';
				editIcon.style.cursor = 'pointer';
				editIcon.style.marginRight = '20px';
				editIcon.style.color = 'green';

				const deleteIcon = document.createElement('i');
				deleteIcon.className = 'fas fa-trash';
				deleteIcon.title = 'Delete';
				deleteIcon.style.cursor = 'pointer';
				deleteIcon.style.color = 'red';

				editIcon.addEventListener('click', () => {
					openTaskModal('edit', task);
				});

				deleteIcon.addEventListener('click', () => {
					const confirmDelete = confirm(`Are you sure you want to delete task: ${task.name}?`);
					if (confirmDelete) {
						fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
							.then(response => {
								if (response.ok) {
									alert('Task deleted successfully.');
									row.remove();
								} else {
									alert('Failed to delete task.');
								}
							});
					}
				});

				modifyorDeleteCell.appendChild(editIcon);
				modifyorDeleteCell.appendChild(deleteIcon);
				row.appendChild(idCell);
				row.appendChild(assigneeCell);
				row.appendChild(titleCell);
				row.appendChild(descCell);
				row.appendChild(duedateCell);
				row.appendChild(comCell);
				row.appendChild(modifyorDeleteCell);

				tableBody.appendChild(row);
			});

			//new DataTable('#TaskData');
			$('#TaskData').DataTable({
				responsive: true,
				autoWidth: false,
				pageLength: 5,
				lengthMenu: [5, 10, 15, 25],
				columnDefs: [
					{ targets: 4, orderable: false } // Disable sorting on "Actions"
				],
				dom: '<"d-flex justify-content-between align-items-center mb-3"fB>t<"d-flex justify-content-between align-items-center mt-3"lip>',
				language: {
					search: "_INPUT_",
					searchPlaceholder: "Search tasks..."
				}
			});
		})
		.catch(error => {
			console.error('Error fetching tasks:', error);
		});
}




