let cardsContainer = document.getElementById("cardsContainer");

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

let favorites;
if (localStorage.getItem("favorites") !== null) {
  favorites = JSON.parse(localStorage.getItem("favorites"));
  cards(favorites);
} else {
  favorites = [];
}
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
              ${
                doctor.gender == "MALE"
                  ? `<img
                  src="../../src/images/male_doctor.png"
                  class="img-fluid rounded-start"
                  alt="Doctor"
                />`
                  : `<img
                  src="../../src/images/doctor.jpg"
                  class="img-fluid rounded-start"
                  alt="Doctor"
                />`
              }
                
                <!-- أيقونة المفضلة -->
              </div>
              <!-- بيانات الدكتور -->
              <div class="col-md-8">
                <div class="position-absolute top-0 end-0 p-2">
                  <button
                    class="btn btn-outline-danger btn-sm border-0 shadow-sm p-2"
                    onclick="deleteFromFavorites('${doctor._id}')"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
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
  window.location.href = `../../src/JS/createConsultation.js?doctorId=${doctorId}`;
  window.location.href = `../pages/patient/createConsultation.html?doctorId=${doctorId}`;
}

function deleteFromFavorites(doctorId) {
  let conf = confirm("Are you sure you want to remove this from favorites?!");
  if (conf) {
    let findDoctorInLocalStorage = favorites.findIndex(
      (e) => e._id == doctorId
    );
    if (findDoctorInLocalStorage !== -1) {
      favorites.splice(findDoctorInLocalStorage, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      cards(favorites);
    }
    if (favorites.length === 0) {
      NoData();
    }
  }
}

if (favorites.length === 0) {
  NoData();
}
