let cardsContainer = document.getElementById("cardsContainer");
function activeReload() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
  document.body.appendChild(loadingOverlay);
}
activeReload();

const apiURL = "https://tamni.vercel.app/api/doctor/Doctors";

fetch(apiURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("حدث خطأ في الطلب: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    document.querySelector(".loading-overlay").remove();
    cards(data.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function cards(data) {
  cardsContainer.innerHTML = "";
  data.forEach((doctor) => {
    let fullName = `${doctor.firstName} ${doctor.middleName} ${doctor.lastName}`;
    cardsContainer.innerHTML += `
      <div class="card">
          <img src="../../src/images/doctor.jpg" alt="Doctor" />
          <div class="favorite"><button onclick="AddToFavorites(this)">♡</button></div>
          <div class="card-content">
            <h4>Dr : ${fullName}</h4>
            <p>📍${doctor.government} : ${doctor.address}<br /><span>${doctor.specialest}</span></p>
            <button onclick="requestConsultation('${doctor._id}')">Request a Consultation</button>
          </div>
      </div>
    `;
  });
}

function requestConsultation(doctorId) {
  console.log("Requesting consultation for doctor ID:", doctorId);
  window.location.href = `../../src/JS/createConsultation.js?doctorId=${doctorId}`;
  window.location.href = `../pages/patient/createConsultation.html?doctorId=${doctorId}`;
}
function AddToFavorites(button) {}
