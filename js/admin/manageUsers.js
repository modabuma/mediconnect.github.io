document.addEventListener("DOMContentLoaded", async function(){
    let preloader = document.getElementById("preloader");
    const membership = document.getElementById("filter-membership");
    const role = document.getElementById("filter-role");
    const document_type = document.getElementById("filter-document-type");
    const department = document.getElementById("filter-department");
    const records = document.getElementById("records");
    const pages = document.getElementById("pages");

    let html = "";
    let html2 = "";

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
    const response5 = await fetch("http://127.0.0.1:5000/administrator/get_users?", options);
    
    const resp_membership = await response.json();
    const resp_role = await response2.json();
    const resp_document_type = await response3.json();
    const resp_department = await response4.json();
    const resp_users = await response5.json();

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

    if (response5.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_users.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp_users.data.records.length; i++){
            const aux = await fetch("https://api-colombia.com/api/v1/Department/"+resp_users.data.records[i].additional_data.department, options2);
            const aux2 = await aux.json();
    
            const aux3 = await fetch("https://api-colombia.com/api/v1/city/"+resp_users.data.records[i].additional_data.city, options2);
            const aux4 = await aux3.json();
    
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(`+resp_users.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp_users.data.records[i].id+`)" style="margin-top: 10px;" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp_users.data.records[i].additional_data.names+`</th>
                <th>`+resp_users.data.records[i].additional_data.lastnames+`</th>
                <th>`+resp_users.data.records[i].membership.description+`</th>
                <th>`+resp_users.data.records[i].role.description+`</th>
                <th>`+resp_users.data.records[i].email+`</th>
                <th>`+resp_users.data.records[i].additional_data.document+`</th>
                <th>`+resp_users.data.records[i].additional_data.document_type.description+`</th>
                <th>`+aux2.name+`</th>
                <th>`+aux4.name+`</th>
                <th>`+resp_users.data.records[i].additional_data.address+`</th>
                <th>`+resp_users.data.records[i].additional_data.phone+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp_users.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
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

async function otherPage(page){
    let preloader = document.getElementById("preloader");
    preloader.style.display="flex";

    const records = document.getElementById("records");
    const pages = document.getElementById("pages");
    pages.innerHTML = "";
    records.innerHTML = "";
    let html = "";
    let html2 = "";

    const options2 = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/administrator/get_users?page="+page, options);

    const resp_users = await response.json();

    if (response.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_users.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp_users.data.records.length; i++){
            const aux = await fetch("https://api-colombia.com/api/v1/Department/"+resp_users.data.records[i].additional_data.department, options2);
            const aux2 = await aux.json();
    
            const aux3 = await fetch("https://api-colombia.com/api/v1/city/"+resp_users.data.records[i].additional_data.city, options2);
            const aux4 = await aux3.json();
    
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(`+resp_users.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp_users.data.records[i].id+`)" style="margin-top: 10px;" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp_users.data.records[i].additional_data.names+`</th>
                <th>`+resp_users.data.records[i].additional_data.lastnames+`</th>
                <th>`+resp_users.data.records[i].membership.description+`</th>
                <th>`+resp_users.data.records[i].role.description+`</th>
                <th>`+resp_users.data.records[i].email+`</th>
                <th>`+resp_users.data.records[i].additional_data.document+`</th>
                <th>`+resp_users.data.records[i].additional_data.document_type.description+`</th>
                <th>`+aux2.name+`</th>
                <th>`+aux4.name+`</th>
                <th>`+resp_users.data.records[i].additional_data.address+`</th>
                <th>`+resp_users.data.records[i].additional_data.phone+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp_users.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
    }
}

async function getDataWithFilters(){
    let preloader = document.getElementById("preloader");
    preloader.style.display="flex";

    let membership = document.getElementById("filter-membership").value;
    let role = document.getElementById("filter-role").value;
    let email = document.getElementById("filter-email").value;
    let document_ = document.getElementById("filter-document").value;
    let document_type = document.getElementById("filter-document-type").value;
    let names = document.getElementById("filter-names").value;
    let lastnames = document.getElementById("filter-lastnames").value;
    let department = document.getElementById("filter-department").value;
    let city = document.getElementById("filter-city").value;
    let address = document.getElementById("filter-address").value;
    let phone = document.getElementById("filter-phone").value;
    let initial_date = document.getElementById("filter-initial-date").value;
    let final_date = document.getElementById("filter-final-date");
    const records = document.getElementById("records");
    const pages = document.getElementById("pages");
    let html = "";
    let html2 = "";
    let filters = "";

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

    if (membership != 0){
        filters += "membership_id="+membership+"&";
    }

    if (role != 0){
        filters += "role="+role+"&";
    }

    filters += "email="+email+"&";
    filters += "document="+document_+"&";

    if (document_type != 0){
        filters += "document_type="+document_type+"&";
    }

    filters += "names="+names+"&";
    filters += "lastnames="+lastnames+"&";
    
    if (department != 0){
        filters += "department="+department+"&";
    }

    if (city != 0){
        filters += "city="+city+"&";
    }

    filters += "address="+address+"&";
    filters += "phone="+phone+"&";

    if (initial_date.length > 0){
        filters += "initial_date="+initial_date+"&";
    }

    if (final_date.length > 0){
        filters += "final_date="+final_date+"&";
    }

    const response = await fetch("http://127.0.0.1:5000/administrator/get_users?"+filters, options);
    const resp_users = await response.json();

    if (response.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_users.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp_users.data.records.length; i++){
            const aux = await fetch("https://api-colombia.com/api/v1/Department/"+resp_users.data.records[i].additional_data.department, options2);
            const aux2 = await aux.json();
    
            const aux3 = await fetch("https://api-colombia.com/api/v1/city/"+resp_users.data.records[i].additional_data.city, options2);
            const aux4 = await aux3.json();
    
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(`+resp_users.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp_users.data.records[i].id+`)" style="margin-top: 10px;" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp_users.data.records[i].additional_data.names+`</th>
                <th>`+resp_users.data.records[i].additional_data.lastnames+`</th>
                <th>`+resp_users.data.records[i].membership.description+`</th>
                <th>`+resp_users.data.records[i].role.description+`</th>
                <th>`+resp_users.data.records[i].email+`</th>
                <th>`+resp_users.data.records[i].additional_data.document+`</th>
                <th>`+resp_users.data.records[i].additional_data.document_type.description+`</th>
                <th>`+aux2.name+`</th>
                <th>`+aux4.name+`</th>
                <th>`+resp_users.data.records[i].additional_data.address+`</th>
                <th>`+resp_users.data.records[i].additional_data.phone+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp_users.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
    }
}

function deleteUser(id){
    Swal.fire({
        title: "¡Atención!",
        text: "¿Deseas eliminar el registro?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#3085d6",
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            delete_(id);
        }
    });
}

async function delete_(id_user){
    const options = {
        method: "DELETE",
        body: JSON.stringify({
            id: id_user
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/administrator/delete_users", options);
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

function redirectToUpdateView(id_user){
    sessionStorage.setItem("id", id_user);

    window.location.href = "../../admin/patient/updateUser.html";
}