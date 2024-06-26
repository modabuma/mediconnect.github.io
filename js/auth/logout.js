document.addEventListener("DOMContentLoaded", function(){
    let access_token = sessionStorage.getItem("access_token");

    if (access_token == undefined){
        window.location.href = "/mediconnect.github.io";
    }
});

async function logout() {
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };
        
    const response = await fetch("http://127.0.0.1:5000/auth/logout", options);
        
    if (response.status != 200){
        Swal.fire({
            title: "¡Atención!",
            text: resp.message,
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
    }
    else{
        sessionStorage.clear();
        window.location.href = "/mediconnect.github.io";
    }
}