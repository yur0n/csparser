document.addEventListener('DOMContentLoaded', function () {
    const popupBtn = document.getElementById("popupBtn");
    const windowText = document.querySelector('.window_text .text');
    const runButton = document.getElementById('button-run');
    const clearButton = document.getElementById('button-clear');
    const offButton = document.querySelector('.header_button:nth-last-child(2)');

    let isRunning = false;
    let interval

    const sideBarStorage = localforage.createInstance({ name: 'sideBarFloat' });

    async function fetchDataAndDisplay() {
        try {

            let storageKeys = await sideBarStorage.keys()
            if (!storageKeys.length) return replyWithErrorBlock({ error: 'No items in the list' })
            let skins = [];
            for (let key of storageKeys) {
                let item = await sideBarStorage.getItem(key)
                skins.push(item)
            }
            const chatId = localStorage.getItem('chatId')
            const autobuy = parseFloat(localStorage.getItem('autobuy_float'));

            let mes = document.createElement('div')
            mes.innerHTML = `<h2>Working...</h2>`
            windowText.appendChild(mes);

            const response = await fetch('/float-parser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ skins, chatId, autobuy })
            });

            const responseData = await response.json();

            console.log('Response Data:', responseData);

            if (responseData?.length) {
                windowText.innerText = '';
                responseData.forEach((items) => {
                    if (!items.length) return;
                    items.forEach((item) => {
                        const resultItem = document.createElement('div');
                        if (item.wrongName) {
                            resultItem.innerHTML = 
                            `<h2>Wrong Name: ${item.wrongName}</h2>
                            <hr>`;
                            windowText.appendChild(resultItem);
                            return;
                        }
                        resultItem.innerHTML = `
                        <h2>New Item Found!</h2>
                        <p>Name: ${item.name}</p>
                        ${item.float ? `<p>Float: ${item.float}</p>` : ''}
                        <p>Price: ¥${item.price}</p>
                        ${autobuy ? `<p>Autobuy Status: ${item.buyStatus ? 'bought successfuly' : 'not bought'}</p>` : ''}
                        <a href="${item.link}" target="_blank"><p>💰  BUY  💰</p></a>
                        <hr>
                        `;
                        console.log(autobuy)
                        // <p>Default Price: ¥${item.defaultPrice}</p>
                        windowText.appendChild(resultItem);
                    });
                });
                if (!windowText.innerHTML) windowText.innerHTML = '<h2>No data available</h2>';
            } else if (responseData?.error) {
                replyWithErrorBlock(responseData)
            } else if (responseData?.message){
                windowText.innerText = responseData.message;
            } else {
                windowText.innerHTML = '<h2>No data available</h2>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            windowText.innerHTML = '<h2>Failed to fetch data</h2>';
        }

        if (isRunning) {
            interval = setTimeout(fetchDataAndDisplay, 10_000);
        }
    }

    function replyWithErrorBlock(message) {
        popupBtn.style.display = "block";
        popupBtn.getElementsByTagName('p')[0].innerText = message.error + (message.url ? ': ' + message.url : '') // `<a href='${(responseData.url || '')}'>${responseData.error}</a>`
        isRunning = false;
        clearInterval(interval)
        runButton.querySelector("span").innerText = "Run";
        runButton.classList.remove("_active");
        runButton.style.pointerEvents = 'none'
        setTimeout(() => runButton.style.pointerEvents = '', 5000)
        windowText.innerText = '';
        window.postMessage({ type: "FROM_PAGE", start: false }, "*");
    }

    runButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (runButton.classList.contains("_active")){
            window.postMessage({ type: "FROM_PAGE", start: false }, "*");
            isRunning = false;
            clearInterval(interval)
            runButton.querySelector("span").innerText = "Run";
            runButton.classList.remove("_active");
            runButton.style.pointerEvents = 'none'
            setTimeout(() => runButton.style.pointerEvents = '', 3000)
        } else {
            if (!document.cookie.includes('steam=true')) {
                popupBtn.style.display = "block";
                popupBtn.getElementsByTagName('p')[0].innerText = 'Please, link your Steam account'
                return
            }
            if (!isRunning) {
                window.postMessage({ type: "FROM_PAGE", start: true }, "*");
                runButton.querySelector("span").innerText = "Off";
                runButton.classList.add("_active");
                isRunning = true;
                fetchDataAndDisplay();
            }
        }
    });

    clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        windowText.innerText = '';
    });

    const autobuy = document.querySelector('.checkbox_autobuy input');
    autobuy.checked = localStorage.getItem('autobuy_float') == 1
    autobuy.addEventListener('change', (e) => {
        localStorage.setItem('autobuy_float', e.target.checked ? 1: 0)
    });
});