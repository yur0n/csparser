document.addEventListener('DOMContentLoaded', function () {
    const popupBtn = document.getElementById("popupBtn");
    const windowText = document.querySelector('.window_text .text');
    const runButton = document.getElementById('button-run');
    const clearButton = document.getElementById('button-clear');
    const goodsIdInput = document.getElementById('goodsId');
    const offButton = document.querySelector('.header_button:nth-last-child(2)');

    let isRunning = false;
    let interval

    // Функция для запроса данных и вывода
    async function fetchDataAndDisplay() {
        try {
            const goodsId = localStorage.getItem('goodsId')
            const chatId = localStorage.getItem('chatId')
            const minProfit = localStorage.getItem('minProfit')
            const stickerOverpay = localStorage.getItem('stickerOverpay')

            const response = await fetch(`/min-price?goodsId=${goodsId}&minProfit=${minProfit}&stickerOverpay=${stickerOverpay}&chatId=${chatId}`);
            const responseData = await response.json();

            console.log('Response Data:', responseData);

            if (responseData?.length) {

                windowText.innerHTML = '';
                responseData.forEach((item, index) => {
                    const resultItem = document.createElement('div');
                    const stickerList = item.stickers.map(sticker => {
                        console.log('Sticker:', sticker); // Отладочный вывод для каждого стикера
                        const stickerPrice = sticker.price === 'потертая' ? sticker.price : `¥${sticker.price}`;
                        return `<li>${sticker.name}: ${stickerPrice}</li>`;
                    }).join('');
                    resultItem.innerHTML = `
                    <h2>New item was found</h2>
                    <p>Name: ${item.name}</p>
                    <p>Default Price: ¥${item.defaultPrice}</p>
                    <p>Stickers:</p>
                    <ul>${stickerList}</ul>
                    <p>Total Sticker Price: ¥${item.total_sticker_price}</p>
                    <p>Profit: ${item.roundedProfit}%</p>
                    <a href="${item.link}" target="_blank"><p>click to buy</p></a> 
                    `;
                    windowText.appendChild(resultItem);

                    //  разделитель после каждого элемента, кроме последнего
                    if (index !== responseData.length - 1) {
                        const divider = document.createElement('hr');
                        windowText.appendChild(divider);
                    }
                });
            } else if (responseData?.error) {
                popupBtn.style.display = "block";
                popupBtn.getElementsByTagName('p')[0].innerText = responseData.error
                isRunning = false;
                clearInterval(interval)
                runButton.querySelector("span").innerText = "Run";
                runButton.classList.remove("_active");
            } else if (responseData?.message){
                windowText.innerText = responseData.message;
            } else {
                windowText.innerText = 'No data available';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            windowText.innerText = 'Failed to fetch data';
        }

        if (isRunning) {
            interval = setTimeout(fetchDataAndDisplay, 12_000);
        }
    }

    goodsIdInput.addEventListener('input', (e) => {
        localStorage.setItem('goodsId', e.target.value)
    })

    // Обработчик события клика на кнопку "Run"
    runButton.addEventListener('click', async (e) => {
        e.preventDefault();
        runButton.style.pointerEvents = 'none'
        setTimeout(() => runButton.style.pointerEvents = '', 2000)
        if (runButton.classList.contains("_active")){
            isRunning = false;
            clearInterval(interval)
            runButton.querySelector("span").innerText = "Run";
            runButton.classList.remove("_active");
        } else {
            if (!document.cookie.includes('steam=true')) {
                popupBtn.style.display = "block";
                popupBtn.getElementsByTagName('p')[0].innerText = 'Please, link your Steam account'
                return
            }
            if (!isRunning) {
                isRunning = true;
                fetchDataAndDisplay();
            }
            runButton.querySelector("span").innerText = "Off";
            runButton.classList.add("_active");
        }
    });

    // Обработчик события клика на кнопку "Clear"
    clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        windowText.innerText = '';
    });
});