document.addEventListener('DOMContentLoaded', function () {
    const popupBtn = document.getElementById("popupBtn");
    const windowText = document.querySelector('.window_text .text');
    const runButton = document.getElementById('button-run');
    const clearButton = document.getElementById('button-clear');
    const offButton = document.querySelector('.header_button:nth-last-child(2)');

    let isRunning = false;
    let interval

    // Функция для запроса данных и вывода
    async function fetchDataAndDisplay() {
        try {
            const goodsId = '857550'
            const minProfit = localStorage.getItem('minProfit')
            const stickerOverpay = localStorage.getItem('stickerOverpay')

            const response = await fetch(`/min-price?goodsId=${goodsId}&minProfit=${minProfit}&stickerOverpay=${stickerOverpay}`);
            const responseData = await response.json();

            console.log('Response Data:', responseData);

            if (responseData && responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {

                windowText.innerHTML = '';
                responseData.data.forEach((item, index) => {
                    const resultItem = document.createElement('div');
                    const stickerList = item.stickers.map(sticker => {
                        console.log('Sticker:', sticker); // Отладочный вывод для каждого стикера
                        const stickerPrice = sticker.price === 'потертая' ? sticker.price : `¥${sticker.price}`;
                        return `<li>${sticker.name}: ${stickerPrice}</li>`;
                    }).join('');
                    resultItem.innerHTML = `
                    <h2>New item was found</h2>
                    <p>Name: ${item.name}</p>
                    <p>Default Price: ${item.defaultPrice}</p>
                    <p>Stickers:</p>
                    <ul>${stickerList}</ul>
                    <p>Total Sticker Price: ¥${item.total_sticker_price}</p>
                    <p>Profit: ${item.roundedProfit}%</p>
                    <a href="${item.link}" target="_blank"><p>click to buy</p></a> 
                `;
                    windowText.appendChild(resultItem);

                    //  разделитель после каждого элемента, кроме последнего
                    if (index !== responseData.data.length - 1) {
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
            } else {
                windowText.innerText = 'No data available';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            windowText.innerText = 'Failed to fetch data';
        }


        if (isRunning) {
            interval = setTimeout(fetchDataAndDisplay, 6000);
        }
    }

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
            if (!localStorage.getItem('steam_id')) {
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