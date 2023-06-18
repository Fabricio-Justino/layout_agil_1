const $dayTaskBar = document.getElementById('day');
const $nightTaskBar = document.getElementById('night');

const $dayTask = $dayTaskBar.querySelector('ul');
const $nightTask = $nightTaskBar.querySelector('ul');

const $todoList = document.querySelectorAll('.todo-list');

const $trash = document.getElementById('trash');

const $dropzones = [$dayTaskBar, $nightTaskBar, $trash];

$dropzones.forEach($dropzone => {
    $dropzone.setAttribute('dropzone', 'move');
    $dropzone.addEventListener('dragenter', handleDragEnter);
    $dropzone.addEventListener('dragleave', handleDragLeave);
    $dropzone.addEventListener('dragover', handleDragOver);
    $dropzone.addEventListener('drop', handleDrop);
});

const $input = document.createElement('input');
$input.type = 'text';
$input.style.outline = 'none';

const $LI = [...Array(...$dayTask.children), ...Array(...$nightTask.children)];

let dragableElement;

$LI.forEach(e => {
    e.addEventListener('dblclick', editTask);
    addEventListenerDraggable(e);
})

$input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter')
        ev.target.blur();
});

$input.addEventListener('focusout', (ev) => {
   inputInsert(ev, $input);
});

$dayTask.parentElement.querySelector('span').addEventListener('click', (ev) => {
    addNewTask($dayTask)
});

$nightTask.parentElement.querySelector('span').addEventListener('click', (ev) => {
    addNewTask($nightTask)
});

function inputInsert(event, input) {
    const $parentLI = event.target.parentElement;
    if (input.value.trim() === '') {
        $parentLI.remove();
        input.remove();
    } else {
        const $textNode = document.createTextNode(input.value);
        $parentLI.appendChild($textNode);
        input.value = '';
        input.remove();
    }
}

function addNewTask(taskNode) {
    const $li = document.createElement('li');
    $li.appendChild($input)
    $li.addEventListener('dblclick', editTask); 
    taskNode.appendChild($li);
    $LI.push($li);
    addEventListenerDraggable($li)
    $input.focus();
}


function addEventListenerDraggable(element) {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
}

function editTask(ev) {
    $input.value = ev.target.innerHTML;
    const $ul = ev.target.parentElement;
    ev.target.remove();
    addNewTask($ul);
}

function handleDragStart(ev) {
    try {
        $trash.style.display = 'block'
        dragableElement = ev.target;
        this.classList.add('is-dragging');

        $dropzones.forEach(e => {
            if (e !== $trash) {
                e.classList.add('dropzone-activate');
            }
        });

    } catch {}
}

function handleDragEnd(ev) {
    try {
        $trash.style.display = 'none'
        ev.target = null;
        this.classList.remove('is-dragging');

        $dropzones.forEach(e => {
            if (e !== $trash) {
                e.classList.remove('dropzone-activate');
            }
        });
    } catch {}
}

/* DROPZONE EVENTS */

function handleDragEnter(ev) {
    if (dragableElement) {
        if (ev.target === $trash) {
            $trash.style.backgroundColor = '#E700009f';
            $trash.style.color = 'white';
            $trash.style.borderColor = 'white'
            $trash.style.transition = '.5s';
        }
    }
}

function handleDragLeave(ev) {
    if (ev.target === $trash) {
        $trash.style.backgroundColor = 'initial';
        $trash.style.color = 'initial';
        $trash.style.borderColor = 'initial';
        $trash.style.transition = '.5s';
    }
}

function handleDragOver(ev) {
    ev.preventDefault();
}

function handleDrop(ev) {
    ev.preventDefault();
    if (dragableElement) {
        if (ev.target === $trash) {
            dragableElement.remove();
        } else {
            this.appendChild(dragableElement);
        }

    }
}