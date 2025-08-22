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
function NoData() {
  cardsContainer.innerHTML = `
    <tr>
        <td colspan="7" class="text-center">
        <iframe 
            src="https://lottie.host/embed/94c24c1c-f68a-4a62-99e6-f5d14bb37f04/MBHNcShOmq.lottie" 
            style="width:100%; height:300px; border:none;">
        </iframe>
        </td>
    </tr>
    `;
}
let allDoctors = [];

let favorites;
if (localStorage.getItem("favorites") !== null) {
  favorites = JSON.parse(localStorage.getItem("favorites"));
} else {
  favorites = [];
}

const apiURL = "https://tamni.vercel.app/api/doctor/Doctors";

fetch(apiURL)
  .then((response) => {
    if (response.status === 404 || response.status === 500) {
      document.querySelector(".loading-overlay").remove();
      NoData();
      throw new Error("حدث خطأ في الطلب: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    document.querySelector(".loading-overlay").remove();
    cards(data.data);
    allDoctors.push(...data.data);
  })
  .catch((error) => {
    document.querySelector(".loading-overlay").remove();
    console.error("Error:", error);
  });

function cards(data) {
  cardsContainer.innerHTML = "";
  data.forEach((doctor) => {
    let fullName = `${doctor.firstName} ${doctor.middleName} ${doctor.lastName}`;
    cardsContainer.innerHTML += `
      <div class="col p-4">
          <div
            class="card h-100 shadow-sm border-0"
            style="max-width: 540px; margin: auto"
          >
            <div class="row g-0">
              <!-- صورة الدكتور -->
              <div class="col-md-4 position-relative">
                <img
                  src="../../src/images/doctor.jpg"
                  class="img-fluid rounded-start"
                  alt="Doctor"
                />
                <!-- أيقونة المفضلة -->
                <div class="favorite position-absolute top-0 end-0 p-2">
                  <button
                    class="btn btn-light btn-sm border-0 shadow-sm"
                    onclick="AddToFavorites('${doctor._id}')"
                  >
                    ♡
                  </button>
                </div>
              </div>
              <!-- بيانات الدكتور -->
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="text-purple card-title fw-bold">Dr: ${fullName}</h5>
                  <p class="card-text small text-muted mb-2">
                    📍 ${doctor.government} : ${doctor.address}<br />
                    <span class="fw-semibold"> 🩺 : ${doctor.specialest}</span>
                  </p>
                  <button
                    class="btn btn-primary btn-sm"
                    onclick="requestConsultation('${doctor._id}')"
                  >
                    Request a Consultation
                  </button>
                </div>
              </div>
            </div>
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

function AddToFavorites(doctorId) {
  let i = allDoctors.findIndex((e) => e._id == doctorId);
  if (i === -1) return alert("Doctor not found");
  let doctorData = allDoctors[i];

  let findDoctorInLocalStorage = favorites.findIndex((e) => e._id == doctorId);

  if (findDoctorInLocalStorage !== -1) {
    alert("doctor is already in favorites");
  } else {
    favorites.push(doctorData);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
