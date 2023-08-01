// choosing elements

const headerEditor = document.querySelector(".editor");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#new-todo");
const submitButton = document.querySelector("#submit-button");
const clearButton = document.querySelector("#clear-all");
const todoList = document.querySelector(".list");
const body = document.querySelector(".body");
const editButtons = document.querySelectorAll(".edit-button");



// Event Listeners
todoForm.addEventListener("submit" , addTodo);
document.addEventListener("DOMContentLoaded" , bringFromStorage);
todoList.addEventListener("click", deleteTodo);
clearButton.addEventListener("click",clearAll)
todoList.addEventListener("click", updateForm);
todoList.addEventListener("click" , editButton);

function editButton(e){
    if(e.target.className == "edit-button" || e.target.className == "fa fa-pencil"){
        const form = e.target.parentElement.parentElement.previousElementSibling;
        form.focus();
    }
}



function updateForm(e){
    if(e.target.className == "todo-text"){
        const oldValue = e.target.value;

        // find all todos from local storage
        const todos = JSON.parse(localStorage.getItem("todos"));

        // find oldvalue from local storage

        const indexOfOldValue = todos.indexOf(oldValue);

        e.target.addEventListener("keydown" , updateKeydown);

        function updateKeydown(e){
            const newValue = e.target.value;
            todos.splice(indexOfOldValue , 1);
            todos.splice(indexOfOldValue , 0 , newValue);
            localStorage.setItem("todos" , JSON.stringify(todos));
        }

    };
}

// Functions
function addTodo(e){
    const newTodo = todoInput.value.trim();

    if(newTodo === ""){
        alert("Please fill the text area");
    } else{
        addToUI(newTodo);
        todoInput.value = ""
        addToStorage(newTodo);
    }
    e.preventDefault()

};

function addToUI(text){
    // create li
    const li = document.createElement("li");
    li.className = "list-item";

    // create input (text area)
    const textArea = document.createElement("input");
    textArea.type = "text";
    textArea.className = "todo-text";
    textArea.value = text;
    textArea.setAttribute("onkeypress","this.style.width = ((this.value.length + 1) * 8) + 'px';");

    //create buttons
    const todoButtons = document.createElement("div");
    todoButtons.className = "todo-buttons";
    todoButtons.innerHTML= '<button class="edit-button"><i class="fa fa-pencil"></i></button> <button class="delete-button">x</button>';

    // places
    li.appendChild((textArea));
    li.appendChild(todoButtons);

    todoList.appendChild(li);

}

function addToStorage(text){
    let todos;

    if(localStorage.getItem("todos") == null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.push(text);

    localStorage.setItem("todos", JSON.stringify(todos));
};

function bringFromStorage(e){
    if(localStorage.getItem("todos") != null){
        const storedTodos = JSON.parse(localStorage.getItem("todos"));
        storedTodos.forEach(function(todo){
            addToUI(todo);
        })
    }
}

function deleteTodo(e){
    
    if(e.target.className == "delete-button"){
        e.target.parentElement.parentElement.remove();
        const inputValue = e.target.parentElement.previousElementSibling.value;
        deleteFromStorage(inputValue);
    }
};

function deleteFromStorage(text){
    const todos = JSON.parse(localStorage.getItem("todos"));
    const textIndex = todos.indexOf(text);
    todos.splice(textIndex , 1);

    localStorage.setItem("todos", JSON.stringify(todos));
};

function clearAll(){

    if(confirm("All todos will be deleted. Are you confirm?")){
        const todosUI = document.querySelectorAll(".list-item");

        todosUI.forEach(function(todo){
            todo.remove();
        })

        localStorage.removeItem("todos")
    }
};