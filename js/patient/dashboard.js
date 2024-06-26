document.addEventListener("DOMContentLoaded", function(){
    let access_token = sessionStorage.getItem("access_token");
    let h2 = document.getElementById("title");

    if (access_token == undefined){
        window.location.href = "../../index.html";
    }

    const [headerB64, payloadB64, signature] = access_token.split('.');
    const payload = JSON.parse(atob(payloadB64));

    h2.textContent = "Le damos la bienvenida, "+payload.sub.names+" "+payload.sub.lastnames;
});
