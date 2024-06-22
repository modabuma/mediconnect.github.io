async function authenticate() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    if (email.trim() == "" || password.trim() == ""){
        Swal.fire({
            title: "¡Atención!",
            text: "Debes digitar todos los campos.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
    }
    else{
        const options = {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const response = await fetch("http://127.0.0.1:5000/auth/login", options);
        
        const resp = await response.json();

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
            sessionStorage.setItem("access_token", resp.data.access_token);
            sessionStorage.setItem("refresh_token", resp.data.refresh_token);
            
            const [headerB64, payloadB64, signature] = resp.data.access_token.split('.');
            const payload = JSON.parse(atob(payloadB64));

            console.log('Payload decodificado:', payload.sub.role);
            
            if (payload.sub.role == "AD"){
                window.location.href = "../../pages/admin/dashboard.html"; 
            }
            else if(payload.sub.role == "DO"){
                window.location.href = "../../pages/doctor/dashboard.html"; 
            }
            else{
                window.location.href = "../../pages/patient/dashboard.html";
            }
        }
    }
}