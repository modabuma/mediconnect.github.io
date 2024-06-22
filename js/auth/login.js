async function authenticate() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    if (email.trim() == "" || password.trim() == ""){
        Swal.fire({
            title: "¡Atenticón!",
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
        
        const data = await response.json();

        console.log(data.message);
    }
}