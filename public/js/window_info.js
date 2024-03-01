let buttonRun = document.querySelector("#button-run");

buttonRun.addEventListener("click", (e) => {
    e.preventDefault();
    if(buttonRun.classList.contains("_active")){
        buttonRun.querySelector("span").innerText = "Run";
        buttonRun.classList.remove("_active");
    } else{
        buttonRun.querySelector("span").innerText = "Off";
        buttonRun.classList.add("_active");
    }
});