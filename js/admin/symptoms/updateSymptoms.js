document.addEventListener("DOMContentLoaded", async function(){
    let code = document.getElementById("filter-code-symptom");
    let description = document.getElementById("filter-desc-symptom");
    let id_user = sessionStorage.getItem("id");
    let loader = document.getElementById("preloader");

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/symptoms/get?id="+id_user, options);

    loader.style.display = "none";

    const resp = await response.json();

    const record = resp.data.records;

    code.value = record[0].code;
    description.value = record[0].description;
});

async function updateSymptom(){
    let loader = document.getElementById("preloader");
    let code = document.getElementById("filter-code-symptom").value;
    let description = document.getElementById("filter-desc-symptom").value;
    let id_user = sessionStorage.getItem("id");

    loader.style.display = "flex";

    const options = {
        method: "PUT",
        body: JSON.stringify({
            id: parseInt(id_user, 10),
            code: code,
            description: description
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/symptoms/update", options);
    const resp = await response.json();

    loader.style.display = "none";

    if (response.status == 200){
        Swal.fire({
            title: "¡Éxito!",
            text: resp.message,
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("id");
                window.location.href = "../../admin/symptoms/manageSymptoms.html";
            } else {
                sessionStorage.removeItem("id");
                window.location.href = "../../admin/symptoms/manageSymptoms.html";
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