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
//activeReload();
function NoData() {
  consultationsContainer.innerHTML = `
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
let filterData = [];
const consultationsContainer = document.getElementById(
  "consultationsContainer"
);
/* fetch("https://tamni.vercel.app/api/doctor/ConsultationsOrders", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((response) => {
    if (
      response.status == 401 ||
      response.status == 404 ||
      response.status == 500
    ) {
      NoData();
    }
    return response.json();
  })
  .then((data) => {
    console.log("Fetched consultations orders:", data.data);
    displayConsultationOrders(data.data);
    filterData.push(...data.data);
    document.querySelector(".loading-overlay").remove();
  })
  .catch((error) => {
    document.querySelector(".loading-overlay").remove();
    NoData();
    console.error("Error fetching consultations orders:", error);
  }); */

function displayConsultationOrders(orders) {
  consultationsContainer.innerHTML = "";
  orders.forEach((order) => {
    let fullName = `${order.patient.firstName} ${order.patient.middleName} ${order.patient.lastName}`;
    consultationsContainer.innerHTML += `
    <div class="container mb-3">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10 col-sm-12">
            <div class="card card-custom shadow">
              <div class="card-body">
                <div
                  class="d-flex justify-content-between align-items-start mb-1"
                >
                  <div>
                    <p class="${handleStatusStyle(order.status)}">Status : ${
      order.status
    }</p>
                    <p>
                      <strong class="text-purple">Patient :</strong>
                      ${fullName}
                    </p>
                    <p>
                      <strong class="text-purple">Phone :</strong> ${
                        order.patient.phone
                      }
                    </p>
                    <p><strong class="text-purple">type :</strong> ${
                      order.type
                    }</p>
                  </div>
                  ${handleActionButtons(order)}
                </div>
                <p>
                  <strong class="text-purple">Description :</strong><br />
                  ${order.description}
                </p>
                <p><strong class="text-purple">Attachments :</strong></p>
                <div class="attachments">
                ${order.attachments
                  .map(
                    (att) => `
                  <a href="${att.fileUrl}" target="_blank"
                    ><i class="bi bi-file-earmark-text"></i> ${att.fileName}</a
                  >
                `
                  )
                  .join("")}
                </div>
                <div class="text-muted text-end">
                  <span>${new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
function acceptConsultation(consultationId, status) {
  activeReload();
  fetch("https://tamni.vercel.app/api/doctor/updateConsultationStatus", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ consultationId, status }),
  }).then((response) => {
    if (response.ok) {
      document.querySelector(".loading-overlay").remove();
      window.location.reload();
      alert("Consultation accepted successfully");
    } else {
      alert("Failed to accept consultation.");
      console.error("Error accepting consultation:", response.statusText);
    }
  });
}
function rejectConsultation(consultationId, status) {
  activeReload();
  fetch("https://tamni.vercel.app/api/doctor/updateConsultationStatus", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ consultationId, status }),
  }).then((response) => {
    if (response.ok) {
      document.querySelector(".loading-overlay").remove();
      window.location.reload();

      alert("Consultation rejected successfully");
    } else {
      alert("Failed to reject consultation.");
      console.error("Error rejecting consultation:", response.statusText);
    }
  });
}
function handleStatusStyle(status) {
  switch (status) {
    case "PENDING":
      return "text-warning";
    case "ACCEPTED":
      return "text-success";
    case "REJECTED":
      return "text-danger";
    case "PAID":
      return "text-info";
    case "COMPLETED":
      return "text-primary";
    default:
      return "";
  }
}
function handleActionButtons(order) {
  switch (order.status) {
    case "PENDING":
      return `
        <div class="d-flex gap-2">
          <button
            class="btn-check-icon"
            onclick="acceptConsultation('${order._id}', 'ACCEPTED')"
          >
            <i class="bi bi-check-lg"></i>
          </button>
          <button
            class="btn-cross-icon"
            onclick="rejectConsultation('${order._id}', 'REJECTED')"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      `;
    case "ACCEPTED":
      return `
        <div class="d-flex gap-2">
          <span class="text-info">Waiting for payment...</span>
        </div>
      `;
    case "PAID":
      return `
        <div class="d-flex gap-2">
          <input  type="file" class="form-control" required />
          <button
            class="btn btn-outline-info"
            onclick="UploadReport('${order._id}')"
          >
            <i class="bi bi-cloud-upload"></i>
          </button>
        </div>
      `;
    case "COMPLETED":
      return `
        <div class="d-flex gap-2">
          <span class="text-success">completed consultation</span>
        </div>
      `;
    default:
      return "";
  }
}
function UploadReport(consultationId) {
  const fileInput = document.querySelector('input[type="file"]');
  if (!fileInput.files.length) {
    alert("Please select a file to upload.");
    return;
  } else {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("consultationId", consultationId);
    activeReload();
    fetch("https://tamni.vercel.app/api/doctor/addReport", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        document.querySelector(".loading-overlay").remove();
        window.location.reload();

        alert("Report uploaded successfully");
      } else {
        document.querySelector(".loading-overlay").remove();
        alert("Failed to upload report.");
        console.error("Error uploading report:", response.statusText);
      }
    });
  }
}

/* --------------------------------------------  */
/* --------------------------------------------  */
//               localStorage

function saveSoLocalstorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
async function getConsultationOrder() {
  let key = "consultationOrders";
  let localData = getFromLocalStorage(key);
  if (localData !== null) {
    displayConsultationOrders(localData);
  }
  try {
    let res = await fetch(
      "https://tamni.vercel.app/api/doctor/ConsultationsOrders",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 404 || res.status === 401 || res.status === 500) {
      NoData();
      throw new Error("Network response was not ok");
    }
    let data = await res.json();
    filterData = data.data; // علشان اقدر اعمل فلتر عليهم ف بخزنهم هنا
    if (JSON.stringify(data.data) !== JSON.stringify(localData)) {
      saveSoLocalstorage(key, data.data);
      displayConsultationOrders(data.data);
    }
  } catch (error) {
    console.log("Error : ", error);
  }
}
getConsultationOrder();
/* --------------------------------------------  */
/* --------------------------------------------  */

/* ---------------- filter logic ------------- */

let Selected_filter = document.getElementById("Selected_filter");
let PENDING_FILTER = document.getElementById("PENDING_FILTER");
let PAID_FILTER = document.getElementById("PAID_FILTER");

Selected_filter.addEventListener("change", (e) => {
  if (e.target.value === "PENDING") {
    let newFilter = filterData.filter((e) => e.status == "PENDING");
    if (newFilter.length === 0) {
      NoData();
    } else {
      displayConsultationOrders(newFilter);
    }
    return;
  } else if (e.target.value === "COMPLETED") {
    let newFilter = filterData.filter((e) => e.status == "COMPLETED");
    if (newFilter.length === 0) {
      NoData();
    } else {
      displayConsultationOrders(newFilter);
    }
    return;
  } else if (e.target.value === "PAID") {
    let newFilter = filterData.filter((e) => e.status == "PAID");
    if (newFilter.length === 0) {
      NoData();
    } else {
      displayConsultationOrders(newFilter);
    }
    return;
  } else if (e.target.value === "ACCEPTED") {
    let newFilter = filterData.filter((e) => e.status == "ACCEPTED");
    if (newFilter.length === 0) {
      NoData();
    } else {
      displayConsultationOrders(newFilter);
    }
    return;
  } else {
    displayConsultationOrders(filterData);
    return;
  }
});

PENDING_FILTER.addEventListener("click", () => {
  let newFilter = filterData.filter((e) => e.status == "PENDING");
  if (newFilter.length === 0) {
    NoData();
  } else {
    displayConsultationOrders(newFilter);
  }
  return;
});
PAID_FILTER.addEventListener("click", () => {
  let newFilter = filterData.filter((e) => e.status == "PAID");
  if (newFilter.length === 0) {
    NoData();
  } else {
    displayConsultationOrders(newFilter);
  }
  return;
});
