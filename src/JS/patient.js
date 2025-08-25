function activeReload(show = true) {
  let overlay = document.querySelector('.loading-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>`;
      document.body.appendChild(overlay);
    }
  } else {
    if (overlay) overlay.remove();
  }
}
activeReload(true);
let consultations = []; // نخزن البيانات
const statusConfig = {
  pending: {
    icon: '<i class="fa-regular fa-clock text-warning"></i>',
    buttons: [
      { text: 'edit', className: 'editBtn btn btn-sm btn-warning', action: (item) => EditConsultation(item._id) },
      { text: 'Delete', className: 'btn btn-sm btn-danger btn-delete', action: (item) => deleteConsultation(item._id) }
    ]
  },
  rejected: {
    icon: '<i class="fa-solid fa-ban text-danger"></i>',
    buttons: [
      { text: 'Delete', className: 'btn btn-sm btn-danger btn-delete', action: (item) => deleteConsultation(item._id) }
    ]
  },
  accepted: {
    icon: '<i class="fa-solid fa-user-check text-success"></i>',
    buttons: [
      { text: 'Pay', className: 'btn btn-sm btn-success btn-pay', action: (item) => payForConsultation(item._id) }
    ]
  },
  done: {
    icon: '<i class="fa-solid fa-file-medical text-primary"></i>',
    buttons: [
      { text: 'View Report', className: 'btn btn-sm btn-primary btn-report', action: (item) => viewReport(item.report) }
    ]
  },
  completed: {
    icon: '<i class="fa-solid fa-file-medical text-primary"></i>',
    buttons: [
      { text: 'View Report', className: 'btn btn-sm btn-primary btn-report', action: (item) => viewReport(item.report) }
    ]
  },
  paid: {
    icon: '<i class="fa-solid fa-money-bill text-success"></i>',
    buttons: [
      { text: 'waiting report', className: 'btn btn-sm btn-secondary', action: null }
    ]
  },
  deleted: {
    icon: '<i class="fa-solid fa-ban text-danger"></i>',
    buttons: []
  },
  default: {
    icon: '<i class="fa-solid fa-info-circle text-secondary"></i>',
    buttons: []
  }
};

function getStatusConfig(status) {
  return statusConfig[status?.toLowerCase()] || statusConfig.default;
}

function createBtn({ text, className, action }, item) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = text;
  if (action) btn.onclick = () => action(item);
  return btn;
}

function createConsultCard(item) {
  const status = (item.status || "").toLowerCase();
  let fullName = `${item.doctor?.firstName || ""} ${item.doctor?.middleName || ""} ${item.doctor?.lastName || ""}`;
  const slide = document.createElement("div");
  slide.className = "swiper-slide d-flex h-100";
  const card = document.createElement("div");
  card.className = "consult-card card border-0 shadow d-flex flex-column justify-content-between w-100";
  card.style.height = "100%";
  // Header
  const header = document.createElement("div");
  header.className = `card-header status-bar text-center ${item.status}`;
  header.innerHTML = `${getStatusConfig(status).icon} <strong>${item.status?.toUpperCase() || ""}</strong>`;
  // Body
  const body = document.createElement("div");
  body.className = "card-body text-center p-2 flex-grow-1";
  body.innerHTML = `<h5 class="card-title mb-1">${`Dr. ${fullName}` || "Doctor"}</h5><p class="mb-1 text-muted small"><b>${item.doctor?.address || ""}</b></p><p class="mb-2 fw-semibold">${item.doctor?.specialest || ""}</p>`;
  // Actions
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "d-flex justify-content-center gap-2 mt-3 card-actions";
  if (status === "deleted") {
    card.classList.add("bg-light", "border", "border-danger", "opacity-75");
    const deletedMsg = document.createElement("div");
    deletedMsg.className = "alert alert-danger text-center mb-0 py-2";
    deletedMsg.textContent = "تم حذف هذه الاستشارة";
    actionsDiv.appendChild(deletedMsg);
  } else {
    getStatusConfig(status).buttons.forEach(btnCfg => {
      actionsDiv.appendChild(createBtn(btnCfg, item));
    });
  }
  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(actionsDiv);
  slide.appendChild(card);
  return slide;
}

function renderConsultations(data) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";
  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class='alert alert-warning text-center'>لا توجد استشارات لعرضها.</div>`;
    return;
  }
  data.forEach((item) => {
    container.appendChild(createConsultCard(item));
  });
  // Initialize Swiper after rendering
  if (window.Swiper) {
    if (window.mySwiperInstance) window.mySwiperInstance.destroy(true, true);
    window.mySwiperInstance = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }
}
// --- replaced by new logic below ---
// fetch("https://tamni.vercel.app/api/patient/MyConsultations", { ... })
//   .then((res) => res.json())
//   .then((data) => { ... })
//   .catch((err) => { ... });

// New logic: load from localStorage, fetch API, compare, update if needed
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

async function loadConsultations() {
  const key = "consultations";
  // 1) Load from localStorage if available
  const localData = getFromLocalStorage(key);
  if (localData && Array.isArray(localData) && localData.length > 0) {
    renderConsultations(localData);
  }
  // 2) Fetch fresh data from API in background
  try {
    const res = await fetch("https://tamni.vercel.app/api/patient/MyConsultations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const apiData = await res.json();
    const apiConsultations = Array.isArray(apiData.data) ? apiData.data : [];
    // 3) Compare new API data with local data
    if (JSON.stringify(apiConsultations) !== JSON.stringify(localData)) {
      // 4) If different, update localStorage and display new data
      saveToLocalStorage(key, apiConsultations);
      renderConsultations(apiConsultations);
    }
    activeReload(false);
  } catch (err) {
    activeReload(false);
    console.error("Error fetching consultations:", err);
  }
}
loadConsultations();

function EditConsultation(id) {
  window.location.href = `updateConsultation.html?id=${id}`;
}

function viewReport(reportUrl) {
  if (reportUrl) {
    window.open(reportUrl, "_blank");
  } else {
    alert("No report available");
  }
}

// تنفيذ الدفع عند الضغط على زر الدفع
  activeReload(true);{
  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً!");
    return;
  }
   payConsultation(id, token)
    .then((data) => {
      activeReload(false);
      alert("تم الدفع بنجاح!\n" + (data.message || ""));
      location.reload();
    })
    .catch((err) => {
      alert("حدث خطأ أثناء الدفع: " + (err.message || err));
    });
}

async function payConsultation(consultationId, token) {
  try {
    const response = await fetch("https://tamni.vercel.app/api/patient/PAID", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ consultationId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Payment failed");
    }
    return data;
  } catch (error) {
    console.error("Error in payConsultation:", error);
    throw error;
  }
}
// تنفيذ الحذف عند الضغط على زر الحذف
  activeReload(true);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً!");
    return;
  }
  if (!confirm("هل أنت متأكد أنك تريد حذف الاستشارة؟")) return;{
  deleteConsultationApi(id, token)
    .then((data) => {
      let consultationArr = JSON.parse(
        localStorage.getItem("consultationInfo")
      );
      const existingIndex = consultationArr.findIndex(
        (item) => item.consultationId == id
      );
      if (existingIndex !== -1) {
        // لو موجودة، حدثها
        consultationArr.splice(existingIndex, 1);
        localStorage.setItem(
          "consultationInfo",
          JSON.stringify(consultationArr)
        );
      }
  activeReload(false);
      alert("تم حذف الاستشارة بنجاح!\n" + (data.message || ""));
      location.reload();
    })
    .catch((err) => {
      alert("حدث خطأ أثناء الحذف: " + (err.message || err));
    });
}
async function deleteConsultationApi(consultationId, token) {
  try {
    const response = await fetch(
      "https://tamni.vercel.app/api/patient/deleteConsultation",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ consultationId }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Delete failed");
    }
    return data;
  } catch (error) {
    console.error("Error in deleteConsultationApi:", error);
    throw error;
  }
}
