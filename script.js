/*
1. add items to list via form
2. remove items from list by clicking x button
3. clear all items with 'clear all' button
4. filter the items by typing in the filter field
5. add localStorage to persist items
6. set up removal from localStorage when user clicks clear all or delete
7. click on an item to put into edit mode and add to form
8. update item
9. deploy to Netlify
*/

const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear');
const filterBtn = document.getElementById('filter');
const formBtn = form.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    // hide and un-hide filter and clear all button
    checkUI();
}

// 1.1 Add items
function onAddItemSubmit(e) {
    e.preventDefault();

    const userInput = input.value;
    if (userInput === '') {
        alert('Please add an item');
        return;
    }

    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = list.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(userInput)) {
            alert('That item already exists');
            return;
        }
    }

    // Create item DOM elements
    addItemToDOM(userInput);

    // Add item to localStorage
    addItemtoStorage(userInput);

    checkUI();
    input.value = '';
}

// 1.2 Add items to DOM
function addItemToDOM(userInput) {
    const newLi = document.createElement('li');
    list.appendChild(newLi);

    const inputText = document.createTextNode(userInput);
    newLi.appendChild(inputText);

    const button = createButton('remove-item btn-link text-red');
    newLi.appendChild(button);
}
// 1.3 Add items to DOM - buttons
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

// 1.4 add items to DOM - icon inside buttons
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// 5.1 Add user input items to localStorage
// check if there is anything in existing localStorage
function addItemtoStorage(item) {
    const itemsFromStorage = getItemsFromStorage(); // shortened code from 5.2, no repeats

    // if (localStorage.getItem('items') === null) {
    //     itemsFromStorage = [];
    // } else {
    //     itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    // }

    // add new item into array
    itemsFromStorage.push(item);

    //convert to JSON string and set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage)); // set 'items' as key for storage
}

// 5.2 Retrieve items from local storage
function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    // if the clicked target contains class 'remove-item' (button), then run clearItem Fn
    if (e.target.parentElement.classList.contains('remove-item')) {
        clearItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    // if (itemsFromStorage.includes(item)) {
    //     return true;
    // } else {
    //     return false;
    // }

    return itemsFromStorage.includes(item);
}

// 7. Set Edit mode function for items
function setItemToEdit(item) {
    isEditMode = true;
    list.querySelectorAll('li').forEach((item) =>
        item.classList.remove('edit-mode')
    );

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    input.value = item.textContent;
}

//  2 & 6 Fn for clearing item when delete is clicked
function clearItem(item) {
    if (confirm('Are you sure?')) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage Fn referal in #6
        removeItemFromStorage(item.textContent);

        // hide/un-hide filter and clear all button
        checkUI();
    }
}

// 6. Fn to remove item from storage one by one
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // filter out item from array stored TO REMOVE, note that filter() will return a new array with item removed
    // Run filter(callbackFn) on array itemsFromStorage, callback on each element 'i' or whatever name,
    // => return a new array after checking if each element DOES NOT EQUAL to item passed
    // if it is true (none are equal), then inidividual items remain in the array (no change made)
    // if it is false (there is an element in the array that matches with passed in item), exclude matched item from new array

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set/Re-save new filtered array to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// function clearItem(e) {
//     console.log(e.target.parentElement.parentElement);
//     console.log(e.target.parentElement.classList.contains('remove-item'));
//     if (e.target.parentElement.classList.contains('remove-item')) {
//         e.target.parentElement.parentElement.remove();
//     }
// }

// 3 & 6 clear All fn
function clearAll() {
    // clear all from DOM
    if (confirm('Are you sure?')) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    // Clear all from storage using key 'items'
    localStorage.removeItem('items'); // refers back to key set as 'item' in #5.1

    // hide/un-hide filter and clear all button
    checkUI();
}

// 4. filter
function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = list.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Part of steps 1-3 to hide and un-hide filter/clear all button
function checkUI() {
    input.value = '';

    const items = list.querySelectorAll('li');
    if (items.length === 0) {
        clearAllBtn.style.display = 'none';
        filterBtn.style.display = 'none';
    } else {
        clearAllBtn.style.display = 'block';
        filterBtn.style.display = 'block';
    }

    formBtn.innerHTML = '<i class"fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialize app
function init() {
    // Event Listeners
    form.addEventListener('submit', onAddItemSubmit);
    list.addEventListener('click', onClickItem);
    clearAllBtn.addEventListener('click', clearAll);
    filterBtn.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    // hide/un-hide filter and clear all button
    checkUI();
}

init();
