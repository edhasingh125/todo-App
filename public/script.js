const API = window.location.origin;


async function register(){

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            password
        })

    });

    const data = await res.json();

    alert(data.message);

    if(data.message === "Registration Successful"){
        window.location = "login.html";
    }

}


async function login(){

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            password
        })

    });

    const data = await res.json();

    if(data.message === "Login Successful"){

        localStorage.setItem("userId",data.userId);

        window.location = "dashboard.html";

    }
    else{

        alert(data.message);

    }

}


async function addTask(){

    const title = document.getElementById("task").value.trim();

    if(title === ""){
        alert("Please enter a task.");
        return;
    }

    const userId = localStorage.getItem("userId");

    await fetch(API + "/tasks",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            title,
            userId
        })

    });

    document.getElementById("task").value = "";

    loadTasks();

}


async function loadTasks(){

    const userId = localStorage.getItem("userId");

    const res = await fetch(API + "/tasks/" + userId);

    const tasks = await res.json();

    let output = "";

    tasks.forEach(task => {

        output += `
        <div class="task">

            <div class="task-info">

                <h3 class="${task.completed ? "completed" : ""}">
                    ${task.completed ? "✅" : "📌"} ${task.title}
                </h3>

            </div>

            <div class="task-buttons">

                <button
                    class="edit-btn"
                    onclick="editTask('${task._id}','${task.title}')">
                    Edit
                </button>

                <button
                    class="complete-btn"
                    onclick="completeTask('${task._id}')"
                    ${task.completed ? "disabled" : ""}>
                    ${task.completed ? "Completed" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')">
                    Delete
                </button>

            </div>

        </div>
        `;

    });

    document.getElementById("taskList").innerHTML = output;

}


async function deleteTask(id){

    await fetch(API + "/tasks/" + id,{
        method:"DELETE"
    });

    loadTasks();

}

async function editTask(id, oldTitle){

    const newTitle = prompt("Edit Task", oldTitle);

    if(!newTitle || newTitle.trim() === ""){
        return;
    }

    await fetch(API + "/tasks/" + id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            title:newTitle
        })

    });

    loadTasks();

}

async function completeTask(id){

    await fetch(API + "/tasks/" + id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            completed:true
        })

    });

    loadTasks();

}

if(window.location.pathname.includes("dashboard.html")){

    loadTasks();

}