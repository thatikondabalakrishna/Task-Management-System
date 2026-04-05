fetch('/api/tasks')
    .then(res => res.json())
    .then(tasks => {

        let total = tasks.length;
        let completed = tasks.filter(t => t.status === 'COMPLETED').length;
        let pending = tasks.filter(t => t.status === 'PENDING').length;
        let overdue = tasks.filter(t => t.status === 'OVERDUE').length;

        document.getElementById('total').innerText = total;
        document.getElementById('completed').innerText = completed;
        document.getElementById('pending').innerText = pending;
        document.getElementById('overdue').innerText = overdue;

        new Chart(document.getElementById('chart'), {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Overdue'],
                datasets: [{
                    data: [completed, pending, overdue],
                    backgroundColor: ['#198754', '#ffc107', '#dc3545'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // important for custom size
                plugins: {
                    legend: {
                        position: 'bottom'   // cleaner UI
                    }
                }
            }
        });

    });