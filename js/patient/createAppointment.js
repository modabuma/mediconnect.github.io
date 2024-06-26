document.addEventListener("DOMContentLoaded", async function(){
    const doctor = document.getElementById("filter-doctor");
    const symptom = document.getElementById("filter-symptom");

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response2 = await fetch("http://127.0.0.1:5000/administrator/get_users?option=1&role=2", options);
    const response3 = await fetch("http://127.0.0.1:5000/symptoms/get?option=1", options);

    const resp_doctor = await response2.json();
    const resp_symptom = await response3.json();

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
});

async function getSubSymptoms(){
    const sub_symptom = document.getElementById("filter-sub-symptom");
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

function getRandomFutureDate(maxDaysInFuture) {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * maxDaysInFuture) + 1; // Genera un número aleatorio entre 1 y maxDaysInFuture
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);
    return futureDate;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getAppointmentDates(){
    let date = document.getElementById("filter-date");
    let doctor = document.getElementById("filter-doctor").value;

    date.innerHTML = "<option value='0'>Elige una opción</option>";

    const numberOfDates = 3;
    const maxDaysInFuture = 365;

    if (doctor != 0){
        for (let i = 0; i < numberOfDates; i++) {
            const randomDate = getRandomFutureDate(maxDaysInFuture);
            const option = document.createElement('option');
            option.textContent = formatDate(randomDate);
            date.appendChild(option);
        }
    }
}

function getRandomHour() {
    const startHour = 8; // Hora de inicio (08:00)
    const endHour = 18; // Hora de fin (18:00)
    const hours = String(Math.floor(Math.random() * (endHour - startHour)) + startHour).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hours}:${minutes}`;
}
async function getAppointments(){
    const symptom = document.getElementById("filter-symptom").value;
    const sub_symptom = document.getElementById("filter-sub-symptom").value;
    const doctor = document.getElementById("filter-doctor").value;
    let records = document.getElementById("records");

    html = "";

    if (symptom != 0 && sub_symptom != 0 && doctor != 0){
        for (let i = 0; i < 3; i++){
            const randomHour = getRandomHour();
            html +=`
            <tr>
                <th>`+randomHour+`</th>
                <th>TELEMEDICINA</th>
                <th>
                    <button class="btn btn-primary btn-sm" onclick="createAppointment('`+randomHour+`')">
                        Asignar cita
                    </button>
                </th>
            <tr>
            `;
        }
    }

    records.innerHTML = html;
}

async function createAppointment(hour){
    const sub_symptom = document.getElementById("filter-sub-symptom").value;
    const doctor = document.getElementById("filter-doctor").value;
    const date = document.getElementById("filter-date").value;
    let access_token = sessionStorage.getItem("access_token");

    const [headerB64, payloadB64, signature] = access_token.split('.');
    const payload = JSON.parse(atob(payloadB64));

    const options = {
        method: "POST",
        body: JSON.stringify({
            sub_symptom_id: parseInt(sub_symptom, 10),
            appointment_date: date,
            id_doctor: parseInt(doctor, 10),
            user_id: parseInt(payload.sub.id, 10),
            hour: hour
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("access_token")
        }
    };

    const response = await fetch("http://127.0.0.1:5000/appointments/create", options);
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