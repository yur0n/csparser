document.addEventListener('DOMContentLoaded', function () {
    const windowText = document.querySelector('.window_text .text');
    const runButton = document.getElementById('button-run');
    const clearButton = document.getElementById('button-clear');
    const offButton = document.querySelector('.header_button:nth-last-child(2)');

    let isRunning = false;

    // Функция для запроса данных и вывода
    async function fetchDataAndDisplay() {
        try {
            // minProfit stickerOverpay находятся в settings.js
            const goodsId = '857550'
            const code = await localStorage.getItem("code")
            const response = await fetch(`/min-price?code=${code}&goodsId=${goodsId}&minProfit=${minProfit}&stickerOverpay=${stickerOverpay}`);
            const responseData = await response.json();

            console.log('Response Data:', responseData);

            if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length) {

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
                    <a href="${item.link}" target="_blank"><p>click to buy</p></a> 
                    `;
                    windowText.appendChild(resultItem);

                    //  разделитель после каждого элемента, кроме последнего
                    if (index !== responseData.data.length - 1) {
                        const divider = document.createElement('hr');
                        windowText.appendChild(divider);
                    }
                });
            } else if (responseData?.error){
                windowText.innerText = responseData.error;
            } else {
                windowText.innerText = 'No data available';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            windowText.innerText = 'Failed to fetch data';
        }


        if (isRunning) {
            setTimeout(fetchDataAndDisplay, 6000);
        }
    }

    // Обработчик события клика на кнопку "Run"
    runButton.addEventListener('click', function () {
        if (!isRunning) {
            isRunning = true; // Устанавливаем флаг выполнения в true
            fetchDataAndDisplay();

            // обработчик события для кнопки "Off"
            const offButton = document.querySelector('.header_button:nth-last-child(2)');
            offButton.addEventListener('click', function(event) {
                event.preventDefault();
                isRunning = false;
            });
        }
    });

    // Обработчик события клика на кнопку "Clear"
    clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        windowText.innerText = '';
    });
});
