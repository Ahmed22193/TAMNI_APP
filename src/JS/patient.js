let cardsContainer = document.getElementById("cards-container");
const TheToken = localStorage.getItem("token");

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
function sttopReload() {
  const overlay = document.querySelector(".loading-overlay");
  if (overlay) overlay.remove();
}

function NoData() {
  cardsContainer.innerHTML = `
    <div class="text-center w-100">
        <iframe 
            src="https://lottie.host/embed/94c24c1c-f68a-4a62-99e6-f5d14bb37f04/MBHNcShOmq.lottie" 
            style="width:100%; height:300px; border:none;">
        </iframe>
    </div>
    `;
}
// activeReload();
// sttopReload();

function cards(data) {
  cardsContainer.innerHTML = "";
  data.forEach((consult) => {
    let url =
      consult.attachments && consult.attachments.length > 0
        ? consult.attachments.map((att) => att.fileUrl)
        : [];
    let fullName = `${consult.doctor.firstName} ${consult.doctor.middleName} ${consult.doctor.lastName}`;
    cardsContainer.innerHTML += `
      <div class="col">
          <div class="card shadow-sm h-100 border-0 rounded-4">
            <!-- صورة الدكتور (اختياري) -->
            <div class=" text-end rounded-top-4">
              ${statusIcon(consult.status)}
            </div>
            <div class="card-body">
              <h5 class="card-title fw-bold text-primary">Dr. ${fullName}</h5>
              <p class="mb-1">
                <i class="bi bi-geo-alt text-danger"></i> ${
                  consult.doctor.address
                }
              </p>
              <p class="mb-2">
                <i class="bi bi-heart-pulse text-success"></i> ${
                  consult.doctor.specialest
                }
              </p>

              <div
                class="description small text-muted"
                style="max-height: 90px; overflow-y: auto"
              >
                ${consult.description}
              </div>
            </div>

            <div
              class="card-footer bg-white border-0 d-flex justify-content-between"
            >
             ${handelBTN(consult._id, consult.status, url[0])}
            </div>
          </div>
        </div>
    `;
  });
}
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
async function fetchAllMyConsultations() {
  key = "MyConsultations";
  const localData = getFromLocalStorage(key);
  if (localData.length > 0) {
    cards(localData);
  } else {
    NoData();
  }
  try {
    const res = await fetch(
      "https://tamni.vercel.app/api/patient/MyConsultations",
      {
        headers: {
          Authorization: `Bearer ${TheToken}`,
        },
      }
    );
    if (res.status === 404) {
      saveToLocalStorage(key, []);
      NoData();
      return;
    }
    if (res.status === 401 || res.status === 500) {
      NoData();
      throw new Error("Network response was not ok");
    } else {
      const apiData = await res.json();
      if (JSON.stringify(apiData.data) !== JSON.stringify(localData)) {
        saveToLocalStorage(key, apiData.data);
        cards(apiData.data); // اعرض الجديد
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    document.getElementById(
      "cards-container"
    ).innerHTML = `<div class='alert alert-danger text-center'>فشل الاتصال بالخادم.</div>`;
  }
}
fetchAllMyConsultations();
function handelBTN(consultationId, status, reportUrl) {
  if (status == "PENDING") {
    return `<button onclick="EditConsultation('${consultationId}')" class="btn btn-outline-primary btn-sm px-3">Edit</button>
            <button onclick="deleteConsultationApi('${consultationId}')" class="btn btn-outline-danger btn-sm px-3">Delete</button>`;
  } else if (status == "COMPLETED") {
    return `<button onclick="viewReport('${reportUrl}')" class="btn btn-outline-primary btn-sm px-3">View Report</button>`;
  } else if (status == "REJECTED") {
    return `<button onclick="deleteConsultationApi('${consultationId}')" class="btn btn-outline-danger btn-sm px-3">Delete</button>`;
  } else if (status == "PAID") {
    return `<button class="btn btn-outline-secondary btn-sm px-3" disabled>Waiting report from doctor</button>`;
  } else if (status == "ACCEPTED") {
    return `<button onclick="payConsultation('${consultationId}')" class="btn btn-success btn-sm px-3">Pay</button>`;
  }
}
function viewReport(reportUrl) {
  if (Array.isArray(reportUrl) && reportUrl.length > 0) {
    window.open(reportUrl[0], "_blank");
  } else {
    alert("No report available");
  }
}

async function deleteConsultationApi(consultationId) {
  if (confirm("are you sure that u want to del consultation ?!")) {
    activeReload();
    try {
      const response = await fetch(
        "https://tamni.vercel.app/api/patient/deleteConsultation",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TheToken}`,
          },
          body: JSON.stringify({ consultationId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }
      sttopReload();
      fetchAllMyConsultations();
      return data;
    } catch (error) {
      console.error("Error in deleteConsultationApi:", error);
      throw error;
    }
  } else {
    alert("deleted canceled");
    sttopReload();
  }
}
async function payConsultation(consultationId) {
  if (confirm("are you sure that u want to confirm payment ?!")) {
    activeReload();
    try {
      const response = await fetch(
        "https://tamni.vercel.app/api/patient/PAID",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TheToken}`,
          },
          body: JSON.stringify({ consultationId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }
      sttopReload();
      fetchAllMyConsultations();
      return data;
    } catch (error) {
      console.error("Error in payConsultation:", error);
      throw error;
    }
  } else {
    alert("payment canceled");
    sttopReload();
  }
}
function EditConsultation(id) {
  window.location.href = `updateConsultation.html?id=${id}`;
}
function statusIcon(status) {
  switch (status) {
    case "PENDING":
      return `<i class="fa-solid p-3 text-warning fa-hourglass-half"></i>`;
    case "REJECTED":
      return `<i class="fa-solid p-3 text-danger fa-circle-xmark"></i>`;
    case "COMPLETED":
      return `<i class="fa-solid p-3 text-success fa-circle-check"></i>`;
    case "ACCEPTED":
      return `<i class="fa-solid p-3 text-primary fa-thumbs-up"></i>`;
    case "PAID":
      return `<i class="fa-solid p-3 text-info fa-sack-dollar"></i>`;
    default:
      return ``;
  }
}
