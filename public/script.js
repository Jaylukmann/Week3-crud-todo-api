const API = "http://localhost:5000/todos";

const list = document.getElementById("todoList");
const form = document.getElementById("todoForm");

async function loadTodos() {

    const res = await fetch(API);

    const todos = await res.json();

    list.innerHTML = "";

    todos.forEach(todo => {

        const li = document.createElement("li");

        if(todo.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${todo.task}</span>

            <div>

                <button onclick="toggleTodo(${todo.id}, ${todo.completed})">
                    ${todo.completed ? "Undo" : "Complete"}
                </button>

                <button onclick="deleteTodo(${todo.id})">
                    Delete
                </button>

            </div>
        `;

        list.appendChild(li);

    });

}

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const task = document.getElementById("task").value;

    await fetch(API,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            task,
            completed:false
        })

    });

    form.reset();

    loadTodos();

});

async function toggleTodo(id,current){

    await fetch(`${API}/${id}`,{

        method:"PATCH",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            completed:!current
        })

    });

    loadTodos();

}

async function deleteTodo(id){

    await fetch(`${API}/${id}`,{

        method:"DELETE"
    });

    loadTodos();

}

loadTodos();