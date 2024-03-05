const steamButton = document.querySelector('.button_account')
const closePopup = document.getElementById("closeBtn")
const popup = document.getElementById("popupBtn");
// const submitButton = document.getElementById("submitAccButton");
// const codeInput = document.getElementById("codeInput");
// const accountStatus = document.querySelector('.account_status')



steamButton.addEventListener('click', (e) => {
	if (e.target.textContent == 'Link Steam') {
		localStorage.setItem('steam_id', true)
		location.replace('/auth/steam')
	}
	if (e.target.textContent == 'Logout') {
		localStorage.removeItem('steam_id')
		location.replace('/logout')
	}
})

closePopup.addEventListener("click", function() {
	popup.style.display = "none";
});

// codeButton.addEventListener("click", () => {
// 	popup.style.display = "block"; // Show the popup
// 	codeInput.value = ""; // Clear previous input
// 	let oldCode = localStorage.getItem('code')
// 	if (oldCode) {
// 		accountStatus.style.color = 'lightgreen'
// 		accountStatus.textContent = 'Code provided'
// 	} else { 
// 		accountStatus.style.color = 'HotPink'
// 		accountStatus.textContent = 'Code not provided'
// 	}
// });

// submitButton.addEventListener("click", async () => {
// 	const code = codeInput.value;
// 	if (code) {
// 		try {
// 			accountStatus.style.color = 'lightblue'
// 			accountStatus.textContent = 'Checking your code...'
// 			const response = await fetch(`/account?code=${code}`);
// 			const responseData = await response.json();
// 			await new Promise(res => setTimeout(res, 1500)) // load imitation
// 			if (responseData.error) {
// 				accountStatus.style.color = 'HotPink'
// 				accountStatus.textContent = responseData.error
// 			} else {
// 				document.cookie = `code=${code}; path=/`;
// 				localStorage.setItem("code", code);
// 				accountStatus.style.color = 'lightgreen'
// 				accountStatus.textContent = responseData.message
// 			}
// 		} catch (e) {
// 			console.log(e)
// 			accountStatus.style.color = 'HotPink'
// 			accountStatus.textContent = 'Server issues'
// 		}
// 		setTimeout(() => {
// 			popup.style.display = "none"
// 			accountStatus.style.color = ''
// 			accountStatus.textContent = ''
// 		}, 2500)
// 	} else {
// 		popup.style.display = "none"; // Hide the popup after submit
// 	}
// });