// SESSION CHECK
if (!localStorage.getItem("loggedInUser") &&
    !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
}
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if (username === "") {
        errorMsg.innerText = "Username cannot be empty";
        return;
    }

    if (password.length < 8) {
        errorMsg.innerText = "Password must be at least 8 characters";
        return;
    }

    localStorage.setItem("loggedInUser", username);

    window.location.href = "home.html";
}


// TASK DATA
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ADD TASK
function addTask() {
    let name = document.getElementById("taskName").value.trim();
    let deadline = document.getElementById("deadline").value;
    let priority = document.getElementById("priority").value;

    if (name === "") return;

    tasks.push({ name, deadline, priority, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateSummary();
}

// SUMMARY
function updateSummary() {
    if (!document.getElementById("totalTasks")) return;

    let completed = tasks.filter(t => t.completed).length;
    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = completed;
}

// PENDING PAGE
// PENDING TASKS PAGE WITH EDIT & DELETE
if (document.getElementById("pendingList")) {
    let list = document.getElementById("pendingList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        if (!task.completed) {
            let li = document.createElement("li");
            li.className = task.priority.toLowerCase();

            li.innerHTML = `
                <strong>${task.name}</strong><br>
                Deadline: ${task.deadline || "N/A"}<br>
                <span class="tag">${task.priority}</span>

                <div class="task-actions">
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})" class="delete-btn">Delete</button>
                    <button onclick="completeTask(${index})">Done</button>
                </div>
            `;
            list.appendChild(li);
        }
    });
}
function editTask(index) {
    let newName = prompt("Edit task name:", tasks[index].name);
    if (newName === null || newName.trim() === "") return;

    let newDeadline = prompt("Edit deadline (YYYY-MM-DD):", tasks[index].deadline);
    let newPriority = prompt("Edit priority (High / Medium / Low):", tasks[index].priority);

    tasks[index].name = newName.trim();
    tasks[index].deadline = newDeadline;
    tasks[index].priority = newPriority;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.reload();
}
function deleteTask(index) {
    let confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.reload();
}


// HISTORY PAGE
if (document.getElementById("historyList")) {
    let list = document.getElementById("historyList");
    tasks.forEach(task => {
        if (task.completed) {
            let li = document.createElement("li");
            li.className = task.priority.toLowerCase();
            li.innerHTML = `
                <strong>${task.name}</strong>
                <span class="tag">${task.priority}</span>
            `;
            list.appendChild(li);
        }
    });
}

// COMPLETE TASK
function completeTask(index) {
    tasks[index].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.reload();
}

// NAVIGATION
function goToPending() {
    window.location.href = "pending.html";
}

function goToHistory() {
    window.location.href = "history.html";
}

function goHome() {
    window.location.href = "home.html";
}

updateSummary();
