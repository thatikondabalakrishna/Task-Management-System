/****************************
 * GLOBAL VARIABLES
 ****************************/
const CARDS_PER_PAGE = 6;
let allTasks = [];
let filteredTasks = [];
let currentPage = 1;

/****************************
 * DOM READY
 ****************************/
document.addEventListener("DOMContentLoaded", function () {

    fetchAllData();

    const viewAllBtn = document.getElementById('viewAllTasks');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function (event) {
            event.preventDefault();
            resetFilter();
        });
    }

    const addNewTaskLink = document.getElementById('addNewTaskLink');
    if (addNewTaskLink) {
        addNewTaskLink.addEventListener('click', function (event) {
            event.preventDefault();
            openTaskModal('create');
        });
    }

    const statusDropdown = document.getElementById('statusFilter');
    if (statusDropdown) {
        statusDropdown.addEventListener('change', function () {
            filterByStatus(this.value);
        });
    }
});

/****************************
 * OPEN MODAL (CREATE / EDIT)
 ****************************/
function openTaskModal(mode, task = null) {

    const modal = document.getElementById('taskModal');
    const modalLabel = document.getElementById('editTaskModalLabel');
    const modalsubmit = document.getElementById('modalsubmit');
    const updateForm = document.getElementById('UpdateTask');

    const taskIdInput = document.getElementById('Id');
    const taskName = document.getElementById('name');
    const taskDesc = document.getElementById('description');
    const taskDue = document.getElementById('duedate');
    const taskStatus = document.getElementById('status');
    const taskAssignee = document.getElementById('assignee');

    taskIdInput.readOnly = false;
    modalsubmit.disabled = false;

    if (mode === 'create') {

        modalLabel.innerText = 'Add New Task';
        modalsubmit.innerText = 'Create Task';
        modalsubmit.className = 'btn btn-primary';

        updateForm.setAttribute('data-mode', 'create');

        taskIdInput.value = '';
        taskName.value = '';
        taskDesc.value = '';
        taskDue.value = '';
        taskStatus.value = 'PENDING';
        taskAssignee.value = '';

    } else if (mode === 'edit' && task) {

        modalLabel.innerText = 'Edit Task Details';
        modalsubmit.innerText = 'Update Task';
        modalsubmit.className = 'btn btn-warning';

        updateForm.setAttribute('data-mode', 'edit');

        taskIdInput.value = task.id;
        taskIdInput.readOnly = true;

        taskName.value = task.name;
        taskDesc.value = task.description;
        taskDue.value = task.duedate;
        taskStatus.value = task.status;
        taskAssignee.value = task.assignedUser?.userName || '';

        modalsubmit.disabled = true;

        ['name', 'description', 'duedate', 'status', 'assignee'].forEach(id => {
            document.getElementById(id).oninput = () => {
                modalsubmit.disabled = false;
            };
        });

        setTimeout(() => taskName.focus(), 300);
    }

    new bootstrap.Modal(modal).show();
}

/****************************
 * CREATE / UPDATE TASK
 ****************************/
async function CreateUpdateTask(event) {
    event.preventDefault();

    const updateForm = document.getElementById('UpdateTask');
    const mode = updateForm.getAttribute('data-mode');

    const taskPayload = {
        id: document.getElementById('Id').value || null,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        duedate: document.getElementById('duedate').value,
        status: document.getElementById('status').value,
        assignedUser: {
            userName: document.getElementById('assignee').value
        }
    };

    let url = '/api/tasks';
    let method = 'POST';

    if (mode === 'edit') {
        url = `/api/tasks/${taskPayload.id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskPayload)
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
            fetchAllData();
        } else {
            alert('Operation failed');
        }

    } catch (error) {
        console.error(error);
        alert('Server error occurred');
    }
}

/****************************
 * FETCH TASKS
 ****************************/
function fetchAllData() {
    fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            allTasks = data;
            filteredTasks = allTasks;   // 👈 IMPORTANT
            currentPage = 1;
            renderTaskPage();
            renderPagination();
        })
        .catch(err => console.error(err));
}

/****************************
 * STATUS FILTER (CLIENT SIDE)
 ****************************/
function filterByStatus(status) {

    if (status === 'ALL') {
        filteredTasks = allTasks;
    } else {
        filteredTasks = allTasks.filter(task => task.status === status);
    }

    currentPage = 1;
    renderTaskPage();
    renderPagination();
}

function resetFilter() {
    const dropdown = document.getElementById('statusFilter');
    if (dropdown) dropdown.value = 'ALL';

    filteredTasks = allTasks;
    currentPage = 1;
    renderTaskPage();
    renderPagination();
}

/****************************
 * RENDER TASK CARDS
 ****************************/
function renderTaskPage() {

    const cardContainer = document.getElementById('taskCardContainer');
    cardContainer.innerHTML = '';

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const pageTasks = filteredTasks.slice(start, start + CARDS_PER_PAGE);

    if (!pageTasks.length) {
        cardContainer.innerHTML = '<p class="text-center">No tasks found</p>';
        return;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';

    pageTasks.forEach(task => {

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card h-100 shadow task-card';

        const body = document.createElement('div');
        body.className = 'card-body';

        body.innerHTML = `
            <h5>${task.name}</h5>
            <h6 class="text-muted">Assigned to: ${task.assignedUser?.userName || 'Unassigned'}</h6>
            <p>${task.description}</p>
            <p><strong>Due:</strong> ${task.duedate}</p>
            <span class="badge ${
                task.status === 'COMPLETED'
                    ? 'bg-success'
                    : task.status === 'OVERDUE'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
            }">${task.status}</span>
        `;

        const footer = document.createElement('div');
        footer.className = 'mt-3 d-flex justify-content-end';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-primary me-2';
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => {
            highlightSelectedCard(card);
            openTaskModal('edit', task);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        footer.append(editBtn, deleteBtn);
        body.appendChild(footer);

        card.appendChild(body);
        col.appendChild(card);
        row.appendChild(col);
    });

    cardContainer.appendChild(row);
}

/****************************
 * CARD HIGHLIGHT
 ****************************/
function highlightSelectedCard(card) {
    document.querySelectorAll('.task-selected')
        .forEach(c => c.classList.remove('task-selected'));

    card.classList.add('task-selected');

    setTimeout(() => {
        card.classList.remove('task-selected');
    }, 1500);
}

/****************************
 * DELETE TASK
 ****************************/
function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchAllData() : alert('Delete failed'));
}

/****************************
 * PAGINATION
 ****************************/
function renderPagination() {

    const totalPages = Math.ceil(filteredTasks.length / CARDS_PER_PAGE);
    const container = document.getElementById('paginationContainer');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i;
        a.onclick = e => {
            e.preventDefault();
            currentPage = i;
            renderTaskPage();
            renderPagination();
        };

        li.appendChild(a);
        ul.appendChild(li);
    }

    container.appendChild(ul);
}
