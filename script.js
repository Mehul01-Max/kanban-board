const modal = document.querySelector(".modal-cont");
modal.style.display = "none";
tickets = [];
function init() {
    if (localStorage.getItem('tickets')) {
        tickets = JSON.parse(localStorage.getItem("tickets"));
        for (ticket of tickets) {
            createTast(ticket["taskColor"], ticket["uid"], ticket["taskDesc"]);
        }
    }
}

const addBtn = document.querySelector(".add-btn");
let toFilter = false;
selectedColor = null;
addBtn.addEventListener('click', () => {
    modal.style.display = "flex";
})

modal.addEventListener('click', () => {
    modal.style.display = "none";
})


const textarea = document.querySelector('.textarea');

textarea.addEventListener('click', (e) => {
    e.stopPropagation();
})
let taskColor = "lightpink";
const mainCont = document.querySelector('.main-cont');
const priorityColor = document.querySelectorAll('.priority-color');
priorityColor.forEach((color) => {
    color.addEventListener('click', () => {
        priorityColor.forEach((c) => {
            c.classList.remove("active");
        })
        color.classList.add("active");
        taskColor = color.classList[0];
    })
}) 
let lock = true;
init();
function createTast(tastColor, id, task) {
    const div = document.createElement('div');
    div.classList.add('ticket-cont');
    div.innerHTML = ` <div class="ticket-color" style = "background-color: ${tastColor};"></div>
             <div class="ticket-id">${id}</div>
             <div class="task-area">${task}</div>
              <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
              </div>`
              
              mainCont.appendChild(div);
              handleRemoval(div, id);
              PriorityChange(div.children[0], id);
              lockUnlock(div.children[3].children[0], lock, id);
              filterFunction(selectedColor);


}
let textareaT = document.querySelector('textarea');
textarea.addEventListener('keydown', (e) => {
    if (e.key == "Shift") {
        const task = textareaT.value;
        const id = shortid();
        createTast(taskColor, id, task);
        modal.style.display = "none";
        data = { uid: id, taskColor: taskColor, taskDesc: task };
        tickets.push(data);
        updateLocalStorage();

    }
})

const trash = document.querySelector('.remove-btn i');
let t = false;
trash.addEventListener('click', () => {
    if (!t) {
        trash.style.color = "red";
        t = true;
    }
    else {
        trash.style.color = "white";
        t = false;
    }
})

function handleRemoval(ticket, id) {
    ticket.addEventListener('click', () => {
        if (t) {
            for (let ticket = 0; ticket < tickets.length; ticket++) {
                if (tickets[ticket]["uid"] == id) {
                    tickets.pop(ticket);
                }
            }
            updateLocalStorage();
            ticket.remove();
        }
    })
}

let colorCount = 0;
function PriorityChange(div, id) {
    const ColorArr = ['lightpink', 'lightgreen', 'lightblue', 'black'];
    div.addEventListener('click', (e) => {
        currentColor = e.target.style.backgroundColor;
        colorCount = ColorArr.indexOf(currentColor) + 1;
        changedColor = ColorArr[colorCount % 4];
        e.target.style.backgroundColor = changedColor;
        for (let ticket = 0; ticket < tickets.length; ticket++) {
            if (tickets[ticket]["uid"] == id) {
                tickets[ticket]["taskColor"] = changedColor;
            }
        }
        updateLocalStorage();
        filterFunction(selectedColor);
    })
}   

function lockUnlock(element, lock, id) {
    element.addEventListener('click', () => {
        if (lock) {
            element.classList.remove('fa-lock');
            element.classList.add('fa-unlock');
            lock = false;
        }
        else {
            element.classList.remove('fa-unlock');
            element.classList.add('fa-lock');
            lock = true;
        }
        editTask(element.parentElement.parentElement.children[2], lock, id);
    })
    
}
function editTask(taskArea, lock, id) {
    if (!lock) {
        taskArea.contentEditable = true;
    }
    else {
        taskArea.contentEditable = false;
        for (let ticket = 0; ticket < tickets.length; ticket++) {
            if (tickets[ticket]["uid"] == id) {
                tickets[ticket]["taskDesc"] = taskArea.textContent;
                updateLocalStorage();
            }
        }
    }
}

const toolBoxColors = document.querySelectorAll('.color');


toolBoxColors.forEach((toolBoxColor) => {
    toolBoxColor.addEventListener('click', (e) => {
        for (toolBoxc of toolBoxColors) {
            if (e.target.style.border === "") {
                toolBoxc.style.border = "";
            }
        }
        selectedColor = e.target.classList[0];
        if (e.target.style.border === "") {
            e.target.style.border = "3px solid red";
            toFilter = true;
        }
        else {
            e.target.style.border = "";
            toFilter = false;
        }
        filterFunction(e);
        filterFunction(selectedColor);
    })
})

function filterFunction(s) {
    allTasks = document.querySelectorAll('.ticket-color');
    if (toFilter) {
        for (task of allTasks) {
            if (task.style.backgroundColor === s) {
                task.parentElement.style.display = "block";
            }
            else {
                task.parentElement.style.display = "none";
            }
        }
    }
    else {
        for (task of allTasks) {
            task.parentElement.style.display = "block";
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}