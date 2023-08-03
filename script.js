// choosing elements
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#new-todo");
const clearButton = document.querySelector("#clear-all");
const todoList = document.querySelector(".list");

// Event Listeners
todoForm.addEventListener("submit" , addTodo);
clearButton.addEventListener("click",clearAll)
todoList.addEventListener("click" , clickTodoList)
document.addEventListener("DOMContentLoaded", pageLoaded);

// Functions

function clickTodoList(e){ // All todoList click functions

    // Updating Todo updateForm
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

    } 
    
    // Click Edit Button
    else if (e.target.className == "edit-button" || e.target.className == "fa fa-pencil"){
        const form = e.target.parentElement.parentElement.previousElementSibling;
        form.focus();

    } 
    
    // Click delete button
    else if(e.target.className == "delete-button"){
        e.target.parentElement.parentElement.remove();
        const inputValue = e.target.parentElement.previousElementSibling.value;
        deleteFromStorage(inputValue);
        deleteCompleted(inputValue , e.target.parentElement.parentElement);
    }

    // Click complete button
    else if(e.target.className == "fa-solid fa-check"){
        e.target.parentElement.parentElement.parentElement.className = "list-item completed";

        const input = e.target.parentElement.parentElement.previousElementSibling;
        input.setAttribute("disabled" , "");

        completeStorage(input.value);
        }
};

function completeStorage(todo){
    let completedTodos;

    if(localStorage.getItem("completedTodos") == null){
        completedTodos = [];
    } else{
        completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    }

    completedTodos.push(todo);

    localStorage.setItem("completedTodos" , JSON.stringify(completedTodos));
}

function deleteCompleted(inputValue , li){

    if(li.className == "list-item completed"){
        const completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
        const index = completedTodos.indexOf(inputValue);

        completedTodos.splice(index , 1);
        localStorage.setItem("completedTodos" , JSON.stringify(completedTodos));
    }
}

function addTodo(e){
    const newTodo = todoInput.value.trim();

    if(localStorage.getItem("todos") != null){
        const todoLength = JSON.parse(localStorage.getItem("todos")).length;
        if(todoLength < 16){
            successAdd();
        } else{
            alert("You have reached the maximum number of todos");
        }
    } else{
        successAdd();
    }

    function successAdd(){
        addToUI(newTodo);
        todoInput.value = ""
        addToStorage(newTodo);
    };

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
    todoButtons.innerHTML= '<button class="complete-button"><i class="fa-solid fa-check"></i></button><button class="edit-button"><i class="fa fa-pencil"></i></button> <button class="delete-button">x</button>';

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

function pageLoaded(){

    //Bring todos from storage
    if(localStorage.getItem("todos") != null){
        const storedTodos = JSON.parse(localStorage.getItem("todos"));
        storedTodos.forEach(function(todo){
            addToUI(todo);
        })
    }

    // Bring completed todos from storage
    if(localStorage.getItem("completedTodos") != null){
        const completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
        
        completedTodos.forEach(function(completed){
            const todos = document.querySelectorAll(".todo-text");
            
            todos.forEach(function(todo){
                if(todo.value == completed){
                    todo.parentElement.className = "list-item completed";
                }
            })
        })
    }

    // Adding "disabled" attribute to completed todos' input
    const completedListItems = document.querySelectorAll(".completed");

    if (completedListItems.length != 0){
        completedListItems.forEach(function(listItem){
            listItem.firstChild.setAttribute("disabled" , "");
        })
    }
}

function deleteFromStorage(text){
    const todos = JSON.parse(localStorage.getItem("todos"));
    const textIndex = todos.indexOf(text);
    todos.splice(textIndex , 1);

    localStorage.setItem("todos", JSON.stringify(todos));
};

function clearAll(){

    if(localStorage.getItem("todos") == null){
        alert("There are no todos to delete");
    } else if(JSON.parse(localStorage.getItem("todos")).length == 0){
         alert("There are no todos to delete");
    } else{
        if(confirm("All todos will be deleted. Are you confirm?")){
            const todosUI = document.querySelectorAll(".list-item");
    
            todosUI.forEach(function(todo){
                todo.remove();
            });
    
            localStorage.removeItem("todos")
            localStorage.removeItem("completedTodos");
        };
    }
};
