document.addEventListener("DOMContentLoaded", async function(){
    let preloader = document.getElementById("preloader");
    const records = document.getElementById("records");
    const pages = document.getElementById("pages");
    const doctor = document.getElementById("filter-doctor");
    const symptom = document.getElementById("filter-symptom");

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
    const response = await fetch("http://127.0.0.1:5000/administrator/get_users?option=1&role=2", options);

    const resp_doctor = await response.json();
    const resp_symptom = await response_symptom.json();

    for (let i = 0; i < resp_doctor.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_doctor.data[i].id;
        option.text = resp_doctor.data[i].additional_data.names+" "+resp_doctor.data[i].additional_data.lastnames;
        doctor.appendChild(option);
    }
    for (let i = 0; i < resp_symptom.data.length; i++){
        const option = document.createElement("option");

        option.value = resp_symptom.data[i].id;
        option.text = resp_symptom.data[i].description;
        symptom.appendChild(option);
    }

    const response_appointments = await fetch("http://127.0.0.1:5000/appointments/get", options);

    const resp_appointments = await response_appointments.json();

    if (response_appointments.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_appointments.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        let data = [];
        let cont = 0;

        for (let i = 0; i < resp_appointments.data.records.length; i++){
            medical_appointment_id_ = resp_appointments.data.records[i].medical_appointment.id;
            if (data.length == 0){
                data.push({
                    medical_appointment_id: medical_appointment_id_,
                    symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                    sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                    date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                });
            }
            else{
                if (data[cont] != undefined){
                    if (data[cont].medical_appointment_id == medical_appointment_id_){
                        data[cont].doctor = resp_appointments.data.records[i].user.additional_data.names+" "+resp_appointments.data.records[i].user.additional_data.lastnames;
                    }
                    cont+=1;
                }
                else{
                    data.push({
                        medical_appointment_id: medical_appointment_id_,
                        symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                        sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                        date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                    });
                }
            }
        }

        for (let i = 0; i < data.length; i++){
            html +=`
            <tr>
                <th>
                    <button onclick="cancelAppointment(`+data[i].medical_appointment_id+`)" class="btn btn-danger btn-sm">
                        Cancelar
                    </button>
                </th>
                <th>`+data[i].doctor+`</th>
                <th>`+data[i].symptom+`</th>
                <th>`+data[i].sub_symptom+`</th>
                <th>`+data[i].date+`</th>
            <tr>
            `;
        }

        for (let i = 0; i < resp_appointments.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
    }
});

async function getDataWithFilters(){
    let preloader = document.getElementById("preloader");
    preloader.style.display="flex";

    let initial_date = document.getElementById("filter-initial-date").value;
    let final_date = document.getElementById("filter-final-date").value;
    const symptom = document.getElementById("filter-symptom").value;
    const sub_symptom = document.getElementById("filter-sub-symptom").value;
    const doctor = document.getElementById("filter-doctor").value;
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

    if (symptom != 0){
        filters += "symptom_id="+symptom+"&";
    }

    if (sub_symptom != 0){
        filters += "sub_symptom_id="+sub_symptom+"&";
    }

    if (doctor != 0){
        filters += "doctor_id="+doctor+"&";
    }

    if (initial_date.length > 0){
        filters += "initial_date="+initial_date+"&";
    }

    if (final_date.length > 0){
        filters += "final_date="+final_date+"&";
    }

    const response_appointments = await fetch("http://127.0.0.1:5000/appointments/get?"+filters, options);

    const resp_appointments = await response_appointments.json();

    if (response_appointments.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_appointments.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        let data = [];
        let cont = 0;

        for (let i = 0; i < resp_appointments.data.records.length; i++){
            medical_appointment_id_ = resp_appointments.data.records[i].medical_appointment.id;
            if (data.length == 0){
                data.push({
                    medical_appointment_id: medical_appointment_id_,
                    symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                    sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                    date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                });

                if (doctor != 0){
                    data[i].doctor = resp_appointments.data.records[i].user.additional_data.names+" "+resp_appointments.data.records[i].user.additional_data.lastnames;
                }
            }
            else{
                if (data[cont] != undefined){
                    if (data[cont].medical_appointment_id == medical_appointment_id_){
                        data[cont].doctor = resp_appointments.data.records[i].user.additional_data.names+" "+resp_appointments.data.records[i].user.additional_data.lastnames;
                    }
                    cont+=1;
                }
                else{
                    data.push({
                        medical_appointment_id: medical_appointment_id_,
                        symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                        sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                        date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                    });

                    if (doctor != 0){
                        data[i].doctor = resp_appointments.data.records[i].user.additional_data.names+" "+resp_appointments.data.records[i].user.additional_data.lastnames;
                    }
                }
            }
        }

        for (let i = 0; i < data.length; i++){
            html +=`
            <tr>
                <th>
                    <button onclick="cancelAppointment(`+data[i].medical_appointment_id+`)" class="btn btn-danger btn-sm">
                        Cancelar
                    </button>
                </th>
                <th>`+data[i].doctor+`</th>
                <th>`+data[i].symptom+`</th>
                <th>`+data[i].sub_symptom+`</th>
                <th>`+data[i].date+`</th>
            <tr>
            `;
        }

        for (let i = 0; i < resp_appointments.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
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

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response_appointments = await fetch("http://127.0.0.1:5000/appointments/get?page="+page, options);

    const resp_appointments = await response_appointments.json();

    if (response_appointments.status != 200){
        records.innerHTML = "";
        pages.innerHTML = "";
        Swal.fire({
            title: "¡Atención!",
            text: resp_appointments.message,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: 'Vale'
        });
        preloader.style.display="none";
    }
    else{
        let data = [];
        let cont = 0;

        for (let i = 0; i < resp_appointments.data.records.length; i++){
            medical_appointment_id_ = resp_appointments.data.records[i].medical_appointment.id;
            if (data.length == 0){
                data.push({
                    medical_appointment_id: medical_appointment_id_,
                    symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                    sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                    date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                });
            }
            else{
                if (data[cont] != undefined){
                    if (data[cont].medical_appointment_id == medical_appointment_id_){
                        data[cont].doctor = resp_appointments.data.records[i].user.additional_data.names+" "+resp_appointments.data.records[i].user.additional_data.lastnames;
                    }
                    cont+=1;
                }
                else{
                    data.push({
                        medical_appointment_id: medical_appointment_id_,
                        symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.symptom.description,
                        sub_symptom: resp_appointments.data.records[i].medical_appointment.sub_symptom.description,
                        date: resp_appointments.data.records[i].medical_appointment.appointment_date.split(" ")[0]
                    });
                }
            }
        }

        for (let i = 0; i < data.length; i++){
            html +=`
            <tr>
                <th>
                    <button onclick="cancelAppointment(`+data[i].medical_appointment_id+`)" class="btn btn-danger btn-sm">
                        Cancelar
                    </button>
                </th>
                <th>`+data[i].doctor+`</th>
                <th>`+data[i].symptom+`</th>
                <th>`+data[i].sub_symptom+`</th>
                <th>`+data[i].date+`</th>
            <tr>
            `;
        }

        for (let i = 0; i < resp_appointments.data.pages; i++){
            html2 += "<li class='page-item'><button class='page-link' href='#' onclick='otherPage("+(i+1)+")'>"+(i+1)+"</a></button>";
        }
    
        records.innerHTML = html;
        pages.innerHTML = html2;
    
        preloader.style.display="none";
    }
}

async function getSubSymptoms(){
    const sub_symptom = document.getElementById("filter-sub-symptom")
    const symptom = document.getElementById("filter-symptom").value;

    sub_symptom.innerHTML = "<option value='0'>Elige una opción</option>";

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/sub_symptoms/get?option=1&symptom_id="+symptom, options);
    
    const resp = await response.json();

    for (let i = 0; i < resp.data.length; i++){
        const option = document.createElement("option");

        option.value = resp.data[i].id;
        option.text = resp.data[i].description;
        sub_symptom.appendChild(option);
    }
}

async function cancelAppointment(id){
    Swal.fire({
        title: "¡Atención!",
        text: "¿Deseas cancelar la cita?",
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

    const response = await fetch("http://127.0.0.1:5000/appointments/delete", options);
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