const openSideBar = document.querySelector('main .open-modal-side-bar');
const modalSideBar = document.querySelector('main .modal');
const itemsDiv = document.querySelector('.modal .block_info__window .window_text .text')
const itemNameInput = document.querySelector('.modal .block_info__window .window_header .header_input');
let selectableDivs = document.querySelectorAll('.item-name');
const addBtn = document.getElementById('button-add');
const deleteBtn = document.getElementById('button-delete');

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
	if (selectedDivs) selectedDivs.forEach(div => {
		div.parentElement.remove();
	})
});

addBtn.addEventListener('click', addItem);

function addItem(e) {
	e.preventDefault();
	if (itemNameInput.value.length < 5) return;
	const newItemContainer = document.createElement('div');
	newItemContainer.classList.add('item-container'); 

	const itemName = document.createElement('div');
	itemName.classList.add('item-name');
	itemName.textContent = itemNameInput.value;
	newItemContainer.appendChild(itemName);
  
	const floatRange = document.createElement('div');
	floatRange.classList.add('float-range');
  
	const minFloatInput = document.createElement('input');
	minFloatInput.type = "number";
	minFloatInput.value = 0.01;
	minFloatInput.name = "minFloat";
	floatRange.appendChild(minFloatInput);
  
	const maxFloatInput = document.createElement('input');
	maxFloatInput.type = "number";
	maxFloatInput.value = 0.02;
	maxFloatInput.name = "maxFloat";
	floatRange.appendChild(maxFloatInput);
  
	newItemContainer.appendChild(floatRange);

	itemsDiv.appendChild(newItemContainer);

	selectableDivs = document.querySelectorAll('.item-name');
	itemName.addEventListener('click', function() {
		this.classList.toggle('selected');
	});
	itemNameInput.value = '';
	
}