const myInput = document.getElementById("myInput");
const myList = document.getElementById("myTask");
const clearAllBtn = document.getElementById("clear-btn");
const popUp = document.getElementById("popUp");
const taskCount = document.getElementById("task-count");
const clearAllPopUp = document.getElementById("clearAllPopUp");
const body = document.body;
let tasks = [];

window.onload = function () {
  loadTasks();
  renderTasks();
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = storedTasks;
}

function renderTasks() {
  myList.innerHTML = tasks
    .map(
      (task, index) => `
      <li class="${task.checked ? "checked" : ""}" data-index="${index}">
        ${task.text}
        <button class="checkbutton" onclick="toggleDone(${index})"></button>
        <button class="edit" onclick="editTask(${index})"></button>
        <button class="close" onclick="deleteTask(${index})"></button>
      </li>`
    )
    .join("");

  taskCount.innerText = `Tasks: ${tasks.length}`;

  if (tasks.length > 0) {
    taskCount.style.display = "block";
  } else {
    taskCount.style.display = "none";
  }

  if (tasks.length > 1) {
    clearAllBtn.style.display = "block";
  } else {
    clearAllBtn.style.display = "none";
  }
}

function newElement() {
  const taskText = myInput.value.trim();
  if (taskText !== "") {
    tasks.push({ text: taskText, checked: false });
    myInput.value = "";
    saveTasks();
    renderTasks();
  } else {
    alert("Please type a task");
  }
}

function toggleDone(index) {
  tasks[index].checked = !tasks[index].checked;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  popUp.removeAttribute("hidden");
  body.classList.add("modal-active");
  const confirmButton = document.querySelector(".confirm-btn");
  const cancelButton = document.querySelector(".cancelbutton");
  confirmButton.addEventListener("click", handleDelete);
  cancelButton.addEventListener("click", handleCancel);
  function handleDelete() {
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
    }
    popUp.setAttribute("hidden", true);
    body.classList.remove("modal-active");
    saveTasks();
    renderTasks();
    confirmButton.removeEventListener("click", handleDelete);
    cancelButton.removeEventListener("click", handleCancel);
  }
  function handleCancel() {
    popUp.setAttribute("hidden", true);
    body.classList.remove("modal-active");
  }
}

function clear() {
  clearAllPopUp.removeAttribute("hidden");
  body.classList.add("modal-active");
  document
    .getElementById("confirmclearall")
    .addEventListener("click", function () {
      tasks = [];
      saveTasks();
      renderTasks();
      body.classList.remove("modal-active");
      clearAllPopUp.setAttribute("hidden", true);
    });
  document
    .getElementById("cancelclearall")
    .addEventListener("click", function () {
      clearAllPopUp.setAttribute("hidden", true);
      body.classList.remove("modal-active");
    });
}

clearAllBtn.addEventListener("click", clear);

myInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    newElement();
  }
});

function editTask(index) {
  const editPopUp = document.getElementById("editPopUp");
  const editInput = document.getElementById("editTaskInput");
  const saveButton = document.getElementById("saveTaskEdit");
  const cancelButton = document.getElementById("cancelTaskEdit");
  editPopUp.removeAttribute("hidden");
  body.classList.add("modal-active");
  editInput.value = tasks[index].text;

  saveButton.onclick = function () {
    const newText = editInput.value.trim();
    if (newText) {
      tasks[index].text = newText;
      saveTasks();
      renderTasks();
    }
    closEditPopUp();
  };

  editInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const newText = editInput.value.trim();
      if (newText) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
      }
      closEditPopUp();
    }
  });

  cancelButton.onclick = function () {
    closEditPopUp();
  };

  function closEditPopUp() {
    editPopUp.setAttribute("hidden", true);
    body.classList.remove("modal-active");
  }
}
