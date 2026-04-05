/****************************
 * GLOBAL VARIABLES
 ****************************/
let allTasks = [];
let table;

/****************************
 * DOM READY
 ****************************/
document.addEventListener("DOMContentLoaded", function () {

    fetchAllData();

    document.getElementById('addNewTaskLink')
        ?.addEventListener('click', function (e) {
            e.preventDefault();
            openTaskModal('create');
        });

    // Row highlight
    document.addEventListener('click', function (e) {
        const row = e.target.closest('#TaskData tbody tr');
        if (!row) return;

        document.querySelectorAll('#TaskData tbody tr')
            .forEach(r => r.classList.remove('selected-row'));

        row.classList.add('selected-row');
    });

    // Edit
    document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-btn')) {

            e.stopPropagation();

            const row = e.target.closest('tr');
            const id = row.getAttribute('data-id');

            const task = allTasks.find(t => t.id == id);

            openTaskModal('edit', task);
        }
    });

    // Delete
    document.addEventListener('click', function (e) {
        if (e.target.closest('.delete-btn')) {

            e.stopPropagation();

            const row = e.target.closest('tr');
            const id = row.getAttribute('data-id');

            deleteTask(id);
        }
    });

});

/****************************
 * FETCH TASKS
 ****************************/
function fetchAllData() {
    fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            allTasks = data;
            renderTable();
        })
        .catch(err => console.error(err));
}

/****************************
 * RENDER TABLE (DataTables)
 ****************************/
function renderTable() {

    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';

    allTasks.forEach(task => {

        const tr = document.createElement('tr');
        tr.setAttribute('data-id', task.id);

        tr.innerHTML = `
            <td>${task.id}</td>
            <td>${task.assignedUser?.userName || 'Unassigned'}</td>
            <td>${task.name}</td>
            <td>${task.description || ''}</td>
            <td>${task.duedate}</td>
            <td>
                <span class="badge ${
                    task.status === 'COMPLETED'
                        ? 'bg-success'
                        : task.status === 'OVERDUE'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                }">${task.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // 🔥 Initialize DataTable
    if ($.fn.DataTable.isDataTable('#TaskData')) {
        $('#TaskData').DataTable().destroy();
    }

    table = $('#TaskData').DataTable({
        pageLength: 6,
        lengthChange: false
    });
}

/****************************
 * MODAL
 ****************************/
function openTaskModal(mode, task = null) {

    const modal = new bootstrap.Modal(document.getElementById('taskModal'));

    document.getElementById('taskId').value = task?.id || '';
    document.getElementById('name').value = task?.name || '';
    document.getElementById('description').value = task?.description || '';
    document.getElementById('duedate').value = task?.duedate || '';
    document.getElementById('status').value = task?.status || 'PENDING';
    document.getElementById('assignee').value = task?.assignedUser?.userName || '';

    modal.show();
}

/****************************
 * SAVE
 ****************************/
document.getElementById('taskForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('taskId').value;

    const payload = {
        id: id || null,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        duedate: document.getElementById('duedate').value,
        status: document.getElementById('status').value,
        assignedUser: {
            userName: document.getElementById('assignee').value
        }
    };

    let method = id ? 'PUT' : 'POST';
    let url = id ? `/api/tasks/${id}` : '/api/tasks';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        fetchAllData();
    } else {
        alert('Save failed');
    }
});

/****************************
 * DELETE
 ****************************/
function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchAllData() : alert('Delete failed'));
}

$.fn.dataTable.ext.search.push(function (settings, data) {

    let selectedStatus = $('#statusFilter').val();

    if (selectedStatus === 'ALL') return true;

    let status = data[5].toUpperCase();

    return status.includes(selectedStatus);
});

document.getElementById('statusFilter')
    ?.addEventListener('change', function () {
        table.draw();
});