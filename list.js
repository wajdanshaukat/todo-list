const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const AddUpdateClick = document.getElementById("AddUpdateClick");
let todo = [];
let updateText = null;

todoValue.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
        AddUpdateClick.click();
    }
});


function setAlertMessage(message) { // Move this function definition to the top
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}

// 1. Corrected the function name to match its usage in the onclick attribute.
function CreateToDoItems() { // Previously named `CreateToDoIData`
    if (todoValue.value === "") {
        alert("Please enter your todo text!");
        todoValue.focus();
        return;
    } else {
        let IsPresent = false;
        todo.forEach((element) => {
            if (element.item == todoValue.value) {
                IsPresent = true;
            }
        });

        if (IsPresent) {
            setAlertMessage("This item is already present in the list!");
            return;
        }
    }

    let li = document.createElement("li");
    const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div><div>
                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" /></div>`;

    li.innerHTML = todoItems;
    listItems.appendChild(li);

    let itemList = { item: todoValue.value, status: false };
    todo.push(itemList);
    setLocalStorage();
    todoValue.value = ""; // Moved this after setting the local storage for better clarity.
    setAlertMessage("Todo item Created Successfully!");
}

if (!todo) {
    todo = [];
}

function CompletedToDoItems(e) {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
    }
}

function UpdateToDoItems(e) {
    updateText = e.parentElement.parentElement.querySelector("div");
    todoValue.value = updateText.innerText;

    AddUpdateClick.setAttribute("onclick", "UpdateOnSelectionItems()");
    AddUpdateClick.setAttribute("src", "refresh.png");
    todoValue.focus();
}

function UpdateOnSelectionItems() {
    if (updateText === null) {
        return; // If updateText is not set, just return
    }
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item == todoValue.value) {
            IsPresent = true;
        }
    });

    if (IsPresent) {
        setAlertMessage("This item is already present in the list!");
        return;
    }

    todo.forEach((element) => {
        if (element.item == updateText.innerText.trim()) {
            element.item = todoValue.value;
        }
    });
    setLocalStorage();

    updateText.innerText = todoValue.value; // Update the UI with the new value

    AddUpdateClick.setAttribute("onclick", "CreateToDoItems()");
    AddUpdateClick.setAttribute("src", "plus.png");
    todoValue.value = "";
    setAlertMessage("Todo item Updated Successfully!");
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function DeleteToDoItems(e) {
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

    if (confirm(`Are you sure? Do you want to delete this ${deleteValue}?`)) {
        e.parentElement.parentElement.setAttribute("class", "deleted-item");
        todoValue.focus();

        todo.forEach((element) => {
            if (element.item == deleteValue.trim()) {
                todo.splice(todo.indexOf(element), 1);
            }
        });

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
        const img = document.createElement("img");
        img.src = "check.png";
        img.className = "todo-controls";
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
        e.parentElement.querySelector("div").appendChild(img);
        e.parentElement.querySelector("img.edit").remove();

        todo.forEach((element) => {
            if (e.parentElement.querySelector("div").innerText.trim() == element.item) {
                element.status = true;
            }
        });
        setLocalStorage();
        setAlertMessage("Todo item Completed Successfully!");
    }
}

function ReadToDoItems() {
    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = "";
        if (element.status) {
            style = "style='text-decoration: line-through'";
        }
        const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${element.item
            }
      ${style === "" ? "" : '<img class="todo-controls" src="check.png" />'}</div><div>
      ${style === "" ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />' : ""}
      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" /></div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}
ReadToDoItems();
