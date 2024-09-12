/*
1. add items to list via form
2. remove items from list by clicking x button
3. clear all items with 'clear all' button
4. filter the items by typing in the filter field
5. add localStorage to persist items
6. click on an item to put into edit mode and add to form
7. update item
8. deploy to Netlify
*/

const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear');

function addItem(e) {
    e.preventDefault();

    const userInput = input.value;
    if (userInput === '') {
        alert('Please enter an item to the list');
        return;
    }

    const newLi = document.createElement('li');
    list.appendChild(newLi);

    const inputText = document.createTextNode(userInput);
    newLi.appendChild(inputText);

    const button = createButton('remove-item btn-link text-red');
    newLi.appendChild(button);
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// clear All fn
function clearAll() {
    list.innerHTML = '';
}

// Event Listeners
form.addEventListener('submit', addItem);
clearAllBtn.addEventListener('click', clearAll);
