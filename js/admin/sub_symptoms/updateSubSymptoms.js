document.addEventListener("DOMContentLoaded", async function(){
    let code = document.getElementById("filter-code-sub-symptom");
    let description = document.getElementById("filter-desc-sub-symptom");
    let id_user = sessionStorage.getItem("id");

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/get?id="+id_user, options);

    const sub_symptom = await response.json();
    const record = sub_symptom.data.records;

    code.value = record[0].code;
    description.value = record[0].description;
});



async function updateSubSymptoms(){
    let code = document.getElementById("filter-code-sub-symptom").value;
    let description = document.getElementById("filter-desc-sub-symptom").value;
    let loader = document.getElementById("preloader");
    let id_user = sessionStorage.getItem("id");


    loader.style.display = "flex";

    const options = {
        method: "PUT",
        body: JSON.stringify({
            code: code,
            description: description,
            id: parseInt(id_user,10)
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/update", options);
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
                window.location.href = "../../admin/sub_symptoms/manageSubSymptoms.html";
            } else {
                sessionStorage.removeItem("id");
                window.location.href = "../../admin/sub_symptoms/manageSubSymptoms.html";
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