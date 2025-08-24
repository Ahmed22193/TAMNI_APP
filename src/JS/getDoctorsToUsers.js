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
/*-----------------اللوكال ستورج---------------------*/
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

//activeReload();
function NoData() {
  cardsContainer.innerHTML = "";
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

/*let favorites;
if (localStorage.getItem("favorites") !== null) {
  favorites = JSON.parse(localStorage.getItem("favorites"));
} else {
  favorites = [];
}*/

/*-----------------تعريف متغيرات-------------*/
let favorites = getFromLocalStorage("favorites") || [];

const key = "allDoctors"; // مفتاح التخزين المحلي للأطباء

const apiURL = "https://tamni.vercel.app/api/doctor/Doctors";

/*fetch(apiURL)
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
  });*/
/*-----------------------جلب بيانات--------------------*/
async function fetchAllDoctors() {
  //activeReload();
  const localData = getFromLocalStorage(key);
  if (localData) {
    cards(localData);
  }
  try {
    const res = await fetch(apiURL, { method: "GET" });
    if (res.status === 404 || res.status === 500) {
      document.querySelector(".loading-overlay").remove();
      NoData();
      throw new Error("حدث خطأ في الطلب: " + res.status);
    }
    const apiData = await res.json();
    allDoctors = apiData.data;
    if (JSON.stringify(apiData.data) !== JSON.stringify(localData)) {
      saveToLocalStorage(key, apiData.data);
      cards(apiData.data);
    }
  } catch (err) {
    console.error("Error fetching doctors:", err);
  }
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
              </div>
              <!-- بيانات الدكتور -->
              <div class="col-md-8">
                <!-- أيقونة المفضلة -->
                <div class="favorite position-absolute top-0 end-0 p-2">
                  <button
                    class="btn btn-outline-danger btn-sm border-0 shadow-sm"
                    onclick="AddToFavorites('${doctor._id}')"
                  >
                    <i class="far fa-heart"></i>
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
    alert("doctor is already in favorites👉");
  } else {
    favorites.push(doctorData);
    /*localStorage.setItem("favorites", JSON.stringify(favorites));*/
    /*----------------------المفضلة----------------------*/
    saveToLocalStorage("favorites", favorites);
    alert("added to favorite successfully!🩺❤️");
  }
}

// ------------------ filter ----------------------
let searchBar = document.getElementById("searchBar");
let Specialty_filter = document.getElementById("Specialty_filter");
let governments_filter = document.getElementById("governments_filter");
searchBar.addEventListener("keyup", (e) => {
  if (e.target.value !== "") {
    const searchValue = e.target.value.toLowerCase();
    const filteredDoctors = allDoctors.filter((doctor) => {
      let fullName = `${doctor.firstName} ${doctor.middleName} ${doctor.lastName}`;
      return fullName.toLowerCase().includes(searchValue);
    });
    if (filteredDoctors.length == 0) {
      NoData();
    } else {
      cards(filteredDoctors);
    }
  }
  if (e.target.value === "") {
    cards(allDoctors);
  }
});
governments_filter.addEventListener("change", () => {
  if (governments_filter.value != "") {
    const filteredDoctors = allDoctors.filter((doctor) => {
      return doctor.government == governments_filter.value;
    });
    if (filteredDoctors.length === 0) {
      NoData();
    } else {
      cards(filteredDoctors);
    }
  } else {
    cards(allDoctors);
  }
});
Specialty_filter.addEventListener("change", () => {
  console.log(allDoctors);

  if (Specialty_filter.value != "") {
    const filteredDoctors = allDoctors.filter((doctor) => {
      return doctor.specialest == Specialty_filter.value;
    });
    if (filteredDoctors.length === 0) {
      NoData();
    } else {
      cards(filteredDoctors);
    }
  } else {
    cards(allDoctors);
  }
});

/*--------------------تشغيل----------------*/
fetchAllDoctors();
