const consultationsContainer = document.getElementById(
  "consultationsContainer"
);

fetch("https://tamni.vercel.app/api/doctor/ConsultationsOrders", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched consultations orders:", data.data);
    displayConsultationOrders(data.data);
  })
  .catch((error) => {
    console.error("Error fetching consultations orders:", error);
  });
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
  fetch("https://tamni.vercel.app/api/doctor/updateConsultationStatus", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ consultationId, status }),
  }).then((response) => {
    if (response.ok) {
      alert("Consultation accepted successfully");
    } else {
      alert("Failed to accept consultation.");
      console.error("Error accepting consultation:", response.statusText);
    }
  });
}
function rejectConsultation(consultationId, status) {
  fetch("https://tamni.vercel.app/api/doctor/updateConsultationStatus", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ consultationId, status }),
  }).then((response) => {
    if (response.ok) {
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

    fetch("https://tamni.vercel.app/api/doctor/addReport", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        alert("Report uploaded successfully");
      } else {
        alert("Failed to upload report.");
        console.error("Error uploading report:", response.statusText);
      }
    });
  }
}
