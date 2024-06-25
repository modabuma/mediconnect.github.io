document.addEventListener("DOMContentLoaded", async function(){
    let names = document.getElementById("filter-names");
    let lastnames = document.getElementById("filter-lastnames");
    let document_type = document.getElementById("filter-document-type");
    let document_ = document.getElementById("filter-document");
    let phone = document.getElementById("filter-phone");
    let address = document.getElementById("filter-address");
    let department = document.getElementById("filter-department");
    let city = document.getElementById("filter-city");
    let membership = document.getElementById("filter-membership");
    let id_user = sessionStorage.getItem("id");

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
    const response3 = await fetch("http://127.0.0.1:5000/document_types/get?option=1", options);
    const response4 = await fetch("https://api-colombia.com/api/v1/Department", options2);

    const resp_membership = await response.json();
    const resp_document_type = await response3.json();
    const resp_department = await response4.json();
    
    for (let i = 0; i < resp_membership.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_membership.data[i].id;
        option.text = resp_membership.data[i].description;
        membership.appendChild(option);
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

    const response_user = await fetch("http://127.0.0.1:5000/administrator/get_users?id="+id_user, options);

    const resp = await response_user.json();

    const record = resp.data.records;

    names.value = record[0].additional_data.names;
    lastnames.value = record[0].additional_data.lastnames;
    document_type.value = record[0].additional_data.document_type.id;
    document_.value = record[0].additional_data.document;
    phone.value = record[0].additional_data.phone;
    address.value = record[0].additional_data.address;
    department.value = record[0].additional_data.department;

    const response_city = await fetch("https://api-colombia.com/api/v1/Department/"+record[0].additional_data.department+"/cities", options);

    if (response_city.status != 200){
        city.innerHTML = "<option value='0'>Elige una opción</option>";
    }
    else{
        const resp = await response_city.json();

        for (let i = 0; i < resp.length; i++){
            const option = document.createElement("option");
            
            option.value = resp[i].id;
            option.text = resp[i].name;
            city.appendChild(option);
        }
    }

    city.value = record[0].additional_data.city;
    membership.value = record[0].membership.id;
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

async function updateUser(){
    let names = document.getElementById("filter-names").value;
    let lastnames = document.getElementById("filter-lastnames").value;
    let document_type = document.getElementById("filter-document-type").value;
    let document_ = document.getElementById("filter-document").value;
    let phone = document.getElementById("filter-phone").value;
    let address = document.getElementById("filter-address").value;
    let department = document.getElementById("filter-department").value;
    let city = document.getElementById("filter-city").value;
    let membership = document.getElementById("filter-membership").value;
    let id_user = sessionStorage.getItem("id");

    const options = {
        method: "PUT",
        body: JSON.stringify({
            id: parseInt(id_user, 10),
            names: names,
            lastnames: lastnames,
            document_type: parseInt(document_type, 10),
            document: document_,
            phone: parseInt(phone, 10),
            address: address,
            department: parseInt(department, 10),
            city: parseInt(city, 10),
            membership_id: parseInt(membership, 10)
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/administrator/update_users", options);
    const resp = await response.json();

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
                window.location.href = "../../pages/admin/manageUsers.html";
            } else {
                sessionStorage.removeItem("id");
                window.location.href = "../../pages/admin/manageUsers.html";
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