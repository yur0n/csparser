(()=>{"use strict";document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("popupBtn"),t=document.querySelector(".window_text .text"),n=document.getElementById("button-run"),a=document.getElementById("button-clear");document.querySelector(".header_button:nth-last-child(2)");let r,o=!1;async function i(){try{let e=await sideBarStorage.keys();if(!e.length)return l({error:"No items in the list"});let n=[];for(let t of e){let e=await sideBarStorage.getItem(t);n.push(e)}const a=localStorage.getItem("chatId");let r=document.createElement("div");r.innerHTML="<h2>Working...</h2>",t.appendChild(r);const o=await fetch("/float-parser",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({skins:n,chatId:a})}),i=await o.json();console.log("Response Data:",i),i?.length?(t.innerText="",i.forEach((e=>{e.length&&e.forEach((e=>{const n=document.createElement("div");if(e.wrongName)return n.innerHTML=`<h2>Wrong Name: ${e.wrongName}</h2>\n                            <hr>`,void t.appendChild(n);n.innerHTML=`\n                        <h2>New Item Found!</h2>\n                        <p>Name: ${e.name}</p>\n                        <p>Float: ${e.float}</p>\n                        <p>Price: ¥${e.price}</p>\n                        <p>Default Price: ¥${e.defaultPrice}</p>\n                        <a href="${e.link}" target="_blank"><p>💰  BUY  💰</p></a>\n                        <hr>\n                        `,t.appendChild(n)}))})),t.innerHTML||(t.innerHTML="No data available")):i?.error?l(i):t.innerText=i?.message?i.message:"No data available"}catch(e){console.error("Error fetching data:",e),t.innerText="Failed to fetch data"}o&&(r=setTimeout(i,1e4))}function l(a){e.style.display="block",e.getElementsByTagName("p")[0].innerText=`${a.error}: ${a.url||""}`,o=!1,clearInterval(r),n.querySelector("span").innerText="Run",n.classList.remove("_active"),n.style.pointerEvents="none",setTimeout((()=>n.style.pointerEvents=""),5e3),t.innerText=""}n.addEventListener("click",(async t=>{if(t.preventDefault(),n.classList.contains("_active"))o=!1,clearInterval(r),n.querySelector("span").innerText="Run",n.classList.remove("_active"),n.style.pointerEvents="none",setTimeout((()=>n.style.pointerEvents=""),3e3);else{if(!document.cookie.includes("steam=true"))return e.style.display="block",void(e.getElementsByTagName("p")[0].innerText="Please, link your Steam account");o||(n.querySelector("span").innerText="Off",n.classList.add("_active"),o=!0,i())}})),a.addEventListener("click",(function(e){e.preventDefault(),t.innerText=""}))}))})();