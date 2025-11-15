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
const CARDS_PER_PAGE = 6;
let allTasks = [];
let currentPage = 1;

function fetchAllData() {
  fetch('/api/tasks')
    .then(response => response.json())
    .then(data => {
      allTasks = data;
      currentPage = 1;
      renderTaskPage();
      renderPagination();
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

function renderTaskPage() {
  const cardContainer = document.getElementById('taskCardContainer');
  cardContainer.innerHTML = '';

  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const end = start + CARDS_PER_PAGE;
  const pageTasks = allTasks.slice(start, end);

  const row = document.createElement('div');
  row.className = 'row g-4';

  if (pageTasks.length === 0) {
    cardContainer.innerHTML = '<p class="text-center">No tasks available.</p>';
    return;
  }

  pageTasks.forEach(task => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card task-card h-100 shadow';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = task.name;

    const assignee = document.createElement('h6');
    assignee.className = 'card-subtitle mb-2 text-muted';
    assignee.textContent = `Assigned to: ${task.assignee}`;

    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = task.description;

    const duedate = document.createElement('p');
    duedate.className = 'card-text';
    duedate.innerHTML = `<strong>Due:</strong> ${task.duedate}`;

    const status = document.createElement('span');
    status.className = 'badge';
    status.textContent = task.status;

    if (task.status === 'Completed') {
      status.classList.add('bg-success');
    } else if (task.status === 'OverDue') {
      status.classList.add('bg-danger');
    } else {
      status.classList.add('bg-warning', 'text-dark');
    }

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-sm btn-outline-primary me-2';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => openTaskModal('edit', task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
      const confirmDelete = confirm(`Delete task: ${task.name}?`);
      if (confirmDelete) {
        fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {
              alert('Task deleted.');
              fetchAllData(); // Refresh
            } else {
              alert('Failed to delete.');
            }
          });
      }
    });

    const footer = document.createElement('div');
    footer.className = 'mt-3 d-flex justify-content-between align-items-center';
    footer.appendChild(status);
    const btnGroup = document.createElement('div');
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    footer.appendChild(btnGroup);

    cardBody.appendChild(title);
    cardBody.appendChild(assignee);
    cardBody.appendChild(description);
    cardBody.appendChild(duedate);
    cardBody.appendChild(footer);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  });

  cardContainer.appendChild(row);
}
function renderPagination() {
  const totalPages = Math.ceil(allTasks.length / CARDS_PER_PAGE);
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return; // No need for pagination

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.className = 'pagination justify-content-center';

  // Prev button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  const prevLink = document.createElement('a');
  prevLink.className = 'page-link';
  prevLink.textContent = 'Previous';
  prevLink.href = '#';
  prevLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderTaskPage();
      renderPagination();
    }
  };
  prevLi.appendChild(prevLink);
  ul.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      renderTaskPage();
      renderPagination();
    };
    pageLi.appendChild(pageLink);
    ul.appendChild(pageLi);
  }

  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  const nextLink = document.createElement('a');
  nextLink.className = 'page-link';
  nextLink.textContent = 'Next';
  nextLink.href = '#';
  nextLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderTaskPage();
      renderPagination();
    }
  };
  nextLi.appendChild(nextLink);
  ul.appendChild(nextLi);

  nav.appendChild(ul);
  paginationContainer.appendChild(nav);
}

