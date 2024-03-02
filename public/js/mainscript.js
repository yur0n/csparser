document.addEventListener('DOMContentLoaded', function () {
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
            const code = localStorage.getItem("code")
            const response = await fetch(`/min-price?code=${code}&goodsId=${goodsId}&minProfit=${minProfit}&stickerOverpay=${stickerOverpay}`);
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
                windowText.innerText = responseData.error;
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
    runButton.addEventListener('click', function (e) {
        
        e.preventDefault();
        let proceed = localStorage.getItem('code') && localStorage.getItem('steam_id')
        if (!proceed) return
        if (runButton.classList.contains("_active")){
            runButton.style.pointerEvents = 'none'
            setTimeout(() => runButton.style.pointerEvents = '', 3000)
            isRunning = false;
            clearInterval(interval)
            runButton.querySelector("span").innerText = "Run";
            runButton.classList.remove("_active");
        } else {
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

// const code = localStorage.getItem("code")
// if (!code) return
// const allow = await fetch(`/account?code=${code}`).then(res => res.json())
// if (allow?.message !== 'Access granted') return