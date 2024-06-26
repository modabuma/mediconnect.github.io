document.addEventListener("DOMContentLoaded", async function(){
    const symptom = document.getElementById("filter-code-symptom")

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/symptoms/get?option=1", options);

    const resp_symptom = await response.json();

    for (let i = 0; i < resp_symptom.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_symptom.data[i].id;
        option.text = resp_symptom.data[i].description;
        symptom.appendChild(option);
    }
});



async function createSubSymptoms(){
    let code = document.getElementById("filter-code-sub-symptom").value;
    let description = document.getElementById("filter-desc-sub-symptom").value;
    let loader = document.getElementById("preloader");
    let symptom = document.getElementById("filter-code-symptom").value;


    loader.style.display = "flex";

    const options = {
        method: "POST",
        body: JSON.stringify({
            symptom_id: parseInt(symptom,10),
            code: code,
            description: description,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/create", options);
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