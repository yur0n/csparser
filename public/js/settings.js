let body = document.querySelector("body");
let popupSettings = document.querySelector(".popup_settings");
let popupSettingsBody = popupSettings.querySelector(".popup__body");
let popupSettingsContent = popupSettings.querySelector(".popup__body .popup__content");
let popupSettingsButtonOpen = document.querySelector("#button-open-settings");
let popupSettingsButtonClose = popupSettings.querySelector(".popup__close");
let functionCloseActive = false;
let rangeInputsValue = document.querySelectorAll("#range-value");
let scrollbarWidth;

let tgChatId = document.querySelector('input[name="tg_chat_id"]')
tgChatId.value = localStorage.getItem('chatId') || '0'
tgChatId.addEventListener('change', (e) => {
    localStorage.setItem('chatId', e.target.value)
}) 

popupSettingsButtonOpen.addEventListener("click", (e) => {
    e.preventDefault();
    body.classList.add("lock");
    popupSettings.classList.remove("none");
    setTimeout(() => {
        popupSettings.classList.add("_active");
    }, 20);
    if (!functionCloseActive) {
        popupFotogalereyaClose();
    }
});

function popupFotogalereyaClose() {
    functionCloseActive = true;
    popupSettingsButtonClose.addEventListener("click", () => {
        body.classList.remove("lock");
        popupSettings.classList.remove("_active");
        setTimeout(() => {
            popupSettings.classList.add("none");
        }, 700);
    });

    document.addEventListener('click', function (event) {
        if (!popupSettingsContent.contains(event.target) && popupSettingsBody.contains(event.target)) {
            body.classList.remove("lock");
            popupSettings.classList.remove("_active");
            setTimeout(() => {
                popupSettings.classList.add("none");
            }, 700);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.which === 27) {
            body.classList.remove("lock");
            popupSettings.classList.remove("_active");
            setTimeout(() => {
                popupSettings.classList.add("none");
            }, 700);
        }
    });
};

rangeInputsValue.forEach(rangeInputValue => {
    let parent = rangeInputValue.closest(".block_range");
    let inputValue = parent.querySelector("#input-value");
    let min = rangeInputValue.min;
    let max = rangeInputValue.max;

    if (rangeInputValue.name == 'minProfit') rangeInputValue.value = localStorage.getItem('minProfit') || 1
    if (rangeInputValue.name == 'stickerOverpay') rangeInputValue.value = localStorage.getItem('stickerOverpay') || 20

    inputValue.value = rangeInputValue.value;

    handleRangeInput(rangeInputValue);
    rangeInputValue.addEventListener('input', function (event) {
        inputValue.value = rangeInputValue.value;
        handleRangeInput(rangeInputValue);
    });
    inputValue.addEventListener('blur', function (event) {
        enteringValue(inputValue, rangeInputValue, min, max);
    });
    inputValue.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            enteringValue(inputValue, rangeInputValue, min, max);
        }
    });
});

receiveScrollbar();
document.documentElement.style.setProperty('--scrollbar-width', parseInt(scrollbarWidth));

window.addEventListener('resize', function (event) {
    receiveScrollbar();
    document.documentElement.style.setProperty('--scrollbar-width', parseInt(scrollbarWidth));
});

function enteringValue(inputValue, rangeInputValue, min, max) {
    if (/^\d+$/.test(inputValue.value)) {
        let value = parseInt(inputValue.value);
        if (!isNaN(value)) {
            if (value < min) {
                inputValue.value = min;
            } else if (value > max) {
                inputValue.value = max;
            }
            rangeInputValue.value = inputValue.value;
            handleRangeInput(rangeInputValue);
        } else {
            inputValue.value = min;
            rangeInputValue.value = inputValue.value;
            handleRangeInput(rangeInputValue);
        }
    } else {
        inputValue.value = min;
        rangeInputValue.value = inputValue.value;
        handleRangeInput(rangeInputValue);
    }
}

function handleRangeInput(rangeInput) {
    let value = Math.round((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100)
    if (rangeInput.name == 'stickerOverpay') {
        localStorage.setItem('stickerOverpay', value)
    } else if (rangeInput.name == 'minProfit') {
        localStorage.setItem('minProfit', value)
    }
    rangeInput.style.background = 'linear-gradient(to right, #4554DF 0%, #4554DF ' + value + '%, #D9D9D9 ' + value + '%, #D9D9D9 100%)';
};

function receiveScrollbar() {
    let div = document.createElement('div');
    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    document.body.append(div);
    scrollbarWidth = div.offsetWidth - div.clientWidth;
    div.remove();
}