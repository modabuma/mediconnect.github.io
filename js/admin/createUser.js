document.addEventListener("DOMContentLoaded", async function(){
    const membership = document.getElementById("filter-membership");
    const role = document.getElementById("filter-role");
    const document_type = document.getElementById("filter-document-type");
    const department = document.getElementById("filter-department");

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

    const response = await fetch("http://127.0.0.1:5000/membership/get?option=1", options);
    const response2 = await fetch("http://127.0.0.1:5000/roles/get?option=1", options);
    const response3 = await fetch("http://127.0.0.1:5000/document_types/get?option=1", options);
    const response4 = await fetch("https://api-colombia.com/api/v1/Department", options2);

    const resp_membership = await response.json();
    const resp_role = await response2.json();
    const resp_document_type = await response3.json();
    const resp_department = await response4.json();

    for (let i = 0; i < resp_membership.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_membership.data[i].id;
        option.text = resp_membership.data[i].description;
        membership.appendChild(option);
    }
    for (let i = 0; i < resp_role.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_role.data[i].id;
        option.text = resp_role.data[i].description;
        role.appendChild(option);
    }
    for (let i = 0; i < resp_document_type.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_document_type.data[i].id;
        option.text = resp_document_type.data[i].description;
        document_type.appendChild(option);
    }
    for (let i = 0; i < resp_department.length; i++){
        const option = document.createElement("option");

        option.value = resp_department[i].id;
        option.text = resp_department[i].name;
        department.appendChild(option);
    }
});

async function getCities(){
    let department = document.getElementById("filter-department").value;
    const city = document.getElementById("filter-city");

    city.innerHTML = "";

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch("https://api-colombia.com/api/v1/Department/"+department+"/cities", options);

    if (response.status != 200){
        city.innerHTML = "<option value='0'>Elige una opción</option>";
    }
    else{
        const resp = await response.json();

        for (let i = 0; i < resp.length; i++){
            const option = document.createElement("option");
            
            option.value = resp[i].id;
            option.text = resp[i].name;
            city.appendChild(option);
        }
    }
}

async function createUser(){
    let names = document.getElementById("filter-names").value;
    let lastnames = document.getElementById("filter-lastnames").value;
    let document_type = document.getElementById("filter-document-type").value;
    let document_ = document.getElementById("filter-document").value;
    let phone = document.getElementById("filter-phone").value;
    let address = document.getElementById("filter-address").value;
    let department = document.getElementById("filter-department").value;
    let city = document.getElementById("filter-city").value;
    let email = document.getElementById("filter-email").value;
    let password = document.getElementById("filter-password").value;
    let confirm_password = document.getElementById("filter-confirm-password").value;
    let role = document.getElementById("filter-role").value;
    let membership = document.getElementById("filter-membership").value;

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
            document_type: parseInt(document_type, 10),
            document: document_,
            phone: parseInt(phone, 10),
            address: address,
            department: parseInt(department, 10),
            city: parseInt(city, 10),
            email: email,
            password: password,
            role: parseInt(role, 10),
            membership_id: parseInt(membership, 10)
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