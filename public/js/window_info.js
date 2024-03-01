let buttonRun = document.querySelector("#button-run");
// let buttonStop = document.querySelector("#button-stop");

buttonRun.addEventListener("click", async (e) => {
    e.preventDefault();
    let code = localStorage.getItem('code')
    if (!code) return
    if(buttonRun.classList.contains("_active")){
        buttonRun.querySelector("span").innerText = "Run";
        buttonRun.classList.remove("_active");
    } else{
        buttonRun.querySelector("span").innerText = "Off";
        buttonRun.classList.add("_active");
    }
});

// buttonRun.addEventListener("click", async (e) => {
//     e.preventDefault();

//     if(buttonRun.classList.contains("_active")){
//         buttonRun.querySelector("span").innerText = "Run";
//         buttonRun.classList.remove("_active");
//     } else{
//         let code = localStorage.getItem('code')
//         if (!code) return
//         const allow = await fetch(`/account?code=${code}`).then(res => res.json())
//         if (allow.error) return
//         buttonRun.querySelector("span").innerText = "Running";
//         buttonRun.classList.add("_active");
//     }
// });

// buttonRun.addEventListener("click", async (e) => {
//     e.preventDefault();

//     if(buttonRun.classList.contains("_active")){
//         buttonRun.querySelector("span").innerText = "Run";
//         buttonRun.classList.remove("_active");
//     } else{
//         let code = localStorage.getItem('code')
//         if (!code) return
//         const allow = await fetch(`/account?code=${code}`).then(res => res.json())
//         if (allow.error) return
//         buttonRun.querySelector("span").innerText = "Off";
//         buttonRun.classList.add("_active");
//     }
// });