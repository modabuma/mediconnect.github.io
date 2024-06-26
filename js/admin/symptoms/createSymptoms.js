async function createSymptom(){
    let code = document.getElementById("filter-code-symptom").value;
    let description = document.getElementById("filter-desc-symptom").value;
    let loader = document.getElementById("preloader");

    loader.style.display = "flex";

    const options = {
        method: "POST",
        body: JSON.stringify({
            code: code,
            description: description,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/symptoms/create", options);
    const resp = await response.json();

    loader.style.display = "none";

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