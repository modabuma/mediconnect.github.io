document.addEventListener("DOMContentLoaded", async function(){
    let preloader = document.getElementById("preloader");
    const records = document.getElementById("records");
    const pages = document.getElementById("pages");
    const symptom = document.getElementById("filter-code-symptom")

    let html = "";
    let html2 = "";

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response_symptom = await fetch("http://127.0.0.1:5000/symptoms/get?option=1", options);

    const resp_symptom = await response_symptom.json();

    for (let i = 0; i < resp_symptom.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_symptom.data[i].id;
        option.text = resp_symptom.data[i].description;
        symptom.appendChild(option);
    }
    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/get", options);
    
    const resp = await response.json();

    if (response.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp.data.records.length; i++){
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubSymptom(`+resp.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp.data.records[i].id+`)" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp.data.records[i].symptom.description+`</th>
                <th>`+resp.data.records[i].code+`</th>
                <th>`+resp.data.records[i].description+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
    }
});


async function otherPage(page){
    let preloader = document.getElementById("preloader");
    preloader.style.display="flex";

    const records = document.getElementById("records");
    const pages = document.getElementById("pages");
    pages.innerHTML = "";
    records.innerHTML = "";
    let html = "";
    let html2 = "";

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/get?page="+page, options);

    const resp = await response.json();

    if (response.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp.data.records.length; i++){
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubSymptom(`+resp.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp.data.records[i].id+`)" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp.data.records[i].symptom.description+`</th>
                <th>`+resp.data.records[i].code+`</th>
                <th>`+resp.data.records[i].description+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp.data.pages; i++){
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

    let initial_date = document.getElementById("filter-initial-date").value;
    let final_date = document.getElementById("filter-final-date").value;
    let code_symptom = document.getElementById("filter-code-symptom").value; 
    let code = document.getElementById("filter-code-sub-symptom").value;
    let description = document.getElementById("filter-desc-sub-symptom").value;
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

    if (code_symptom != 0){
        filters += "symptom_id="+code_symptom+"&";
    }

    if (initial_date.length > 0){
        filters += "initial_date="+initial_date+"&";
    }

    if (final_date.length > 0){
        filters += "final_date="+final_date+"&";
    }
    
    filters += "code="+code+"&";
    filters += "description="+description+"&";

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/get?"+filters, options);
    const resp = await response.json();

    if (response.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        for (let i = 0; i < resp.data.records.length; i++){
            html +=`
            <tr>
                <th>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubSymptom(`+resp.data.records[i].id+`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                    <button onclick="redirectToUpdateView(`+resp.data.records[i].id+`)" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                </th>
                <th>`+resp.data.records[i].symptom.description+`</th>
                <th>`+resp.data.records[i].code+`</th>
                <th>`+resp.data.records[i].description+`</th>
            <tr>
            `;
        }
    
        for (let i = 0; i < resp.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;

        preloader.style.display="none";
    }
}

function deleteSubSymptom(id){
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

async function delete_(id){
    const options = {
        method: "DELETE",
        body: JSON.stringify({
            id: id
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/delete", options);
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

function redirectToUpdateView(id){
    sessionStorage.setItem("id", id);

    window.location.href = "../../admin/sub_symptoms/updateSubSymptoms.html";
}