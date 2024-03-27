const openSideBar = document.querySelector('main .open-modal-side-bar');
const modalSideBar = document.querySelector('main .modal');
const itemsDiv = document.querySelector('.modal .block_info__window .window_text .text')
const itemNameInput = document.querySelector('.modal .block_info__window .window_header .header_input');
let selectableDivs = document.querySelectorAll('.item-name');
const addBtn = document.getElementById('button-add');
const deleteBtn = document.getElementById('button-delete');

const sideBarStorage = localforage.createInstance({ name: 'sideBarSticker' });

// load items from sideBarStorage
sideBarStorage.iterate((value, key) => {
	loadItems(key, value);
}).catch(console.error);

openSideBar.addEventListener('click', function(e) {
	e.preventDefault();
	if (modalSideBar.classList.contains('show')) {
		modalSideBar.classList.remove('show')
	} else {
		modalSideBar.classList.add('show')
	}
})


selectableDivs.forEach(div => {
	div.addEventListener('click', function() {
		this.classList.toggle('selected');
	});
});

deleteBtn.addEventListener('click', function(e) {
	e.preventDefault();
	const selectedDivs = document.querySelectorAll('.item-name.selected');
	if (selectedDivs) selectedDivs.forEach(async div => {
		div.parentElement.remove();
		sideBarStorage.removeItem(div.textContent).catch(console.error);
	});
});

addBtn.addEventListener('click', addItem);

async function addItem(e) {
	e.preventDefault();
	let itemNameText = itemNameInput.value;
	if (itemNameInput.value.length < 5) return;
	const allItems = document.querySelectorAll('.item-name');
	for (let i = 0; i < allItems.length; i++) {
		if (allItems[i].textContent === itemNameText) {
			alert('Item with the same name already exists');
			return;
		}
	}
	itemNameInput.value = '';

	await loadItems(itemNameText);
}

async function loadItems(itemNameText) {

	const newItemContainer = document.createElement('div');
	newItemContainer.classList.add('item-container'); 

	const itemName = document.createElement('div');
	itemName.classList.add('item-name');
	itemName.textContent = itemNameText;

	newItemContainer.appendChild(itemName);
	itemsDiv.appendChild(newItemContainer);

	itemName.addEventListener('click', function() {
		this.classList.toggle('selected');
	});

	await sideBarStorage.setItem(itemNameText, itemNameText);
}
