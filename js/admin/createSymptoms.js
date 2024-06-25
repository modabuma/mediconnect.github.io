document.addEventListener("DOMContentLoaded", async function(){
    const code_symptom = document.getElementById("filter-code-symptom");
    const desc_symptom = document.getElementById("filter-desc-symptom");

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const options2 = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const response = await fetch("http://127.0.0.1:5000/symptoms/get?option=1", options);

    const resp_membership = await response.json();
});

async function createSymptom(){
    let code_symptom = document.getElementById("filter-code-symptom").value;
    let desc_symptom = document.getElementById("filter-desc-symptom").value;

    if (password != confirm_password){
        Swal.fire({
            title: "¡Atención!",
            text: "Las contraseñas no coinciden.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
    }

    const options = {
        method: "POST",
        body: JSON.stringify({
            names: names,
            lastnames: lastnames,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/administrator/create_users", options);
    const resp = await response.json();

    if (response.status == 201){
        Swal.fire({
            title: "¡Éxito!",
            text: resp.message,
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        });
    }
    else{
        Swal.fire({
            title: "¡Atención!",
            text: resp.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
    }
}