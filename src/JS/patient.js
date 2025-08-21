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
let consultations = []; // نخزن البيانات

function statusIcon(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return '<i class="fa-regular fa-clock text-warning"></i>';
    case "accepted":
      return '<i class="fa-solid fa-user-check text-success"></i>';
    case "rejected":
      return '<i class="fa-solid fa-ban text-danger"></i>';
    case "done":
      return '<i class="fa-solid fa-file-medical text-primary"></i>';
    default:
      return '<i class="fa-solid fa-info-circle text-secondary"></i>';
  }
}

function renderConsultations(data) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";
  // لو مفيش بيانات
  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class='alert alert-warning text-center'>لا توجد استشارات لعرضها.</div>`;
    return;
  }
  data.forEach((item) => {
    // تجاهل الاستشارات المحذوفة من العرض للمستخدم
    if ((item.status || "").toLowerCase() === "deleted") return;
    let fullName = `${item.doctor?.firstName || ""} ${
      item.doctor?.middleName || ""
    } ${item.doctor?.lastName || ""}`;
    const slide = document.createElement("div");
    slide.className = "swiper-slide d-flex h-100";

    const card = document.createElement("div");
    card.className =
      "consult-card card border-0 shadow d-flex flex-column justify-content-between w-100";
    card.style.height = "100%";
    // Header
    const header = document.createElement("div");
    header.className = `card-header status-bar text-center ${item.status}`;
    header.innerHTML = `${statusIcon(item.status)} <strong>${
      item.status?.toUpperCase() || ""
    }</strong>`;

    // Body
    const body = document.createElement("div");
    body.className = "card-body text-center p-2 flex-grow-1";
    body.innerHTML = `<h5 class="card-title mb-1">${
      `Dr. ${fullName}` || "Doctor"
    }</h5>
      <p class="mb-1 text-muted small"><b>${item.doctor?.address || ""}</b></p>
      <p class="mb-2 fw-semibold">${item.doctor?.specialest || ""}</p>`;
    // Actions
    const actionsDiv = document.createElement("div");
    actionsDiv.className =
      "d-flex justify-content-center gap-2 mt-3 card-actions";
    const status = (item.status || "").toLowerCase();

    // دعم حالة الاستشارة المحذوفة
    if (status === "deleted") {
      // تظليل الكارت وتوضيح أنه محذوف
      card.classList.add("bg-light", "border", "border-danger", "opacity-75");
      const deletedMsg = document.createElement("div");
      deletedMsg.className = "alert alert-danger text-center mb-0 py-2";
      deletedMsg.textContent = "تم حذف هذه الاستشارة";
      actionsDiv.appendChild(deletedMsg);
      card.appendChild(header);
      card.appendChild(body);
      card.appendChild(actionsDiv);
      slide.appendChild(card);
      container.appendChild(slide);
      return;
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      deleteConsultation(item._id);
    };

    if (status === "rejected" || status === "pending") {
      if (status === "pending") {
        const editBtn = document.createElement("button");
        editBtn.className = "editBtn btn btn-sm btn-warning";
        editBtn.textContent = "edit";
        editBtn.onclick = () => {
          EditConsultation(item._id);
        };
        actionsDiv.appendChild(editBtn);
      }
      //delete
      actionsDiv.appendChild(deleteBtn);
    }
    if (status === "done" || status === "completed") {
      const reportBtn = document.createElement("button");
      reportBtn.className = "btn btn-sm btn-primary btn-report";
      reportBtn.textContent = " View Report";
      reportBtn.onclick = () => {
        viewReport(item.report);
      };
      actionsDiv.appendChild(reportBtn);
    }
    if (status === "accepted") {
      const payBtn = document.createElement("button");
      payBtn.className = "btn btn-sm btn-success btn-pay";
      payBtn.textContent = "Pay";
      payBtn.onclick = () => {
        payForConsultation(item._id);
      };
      actionsDiv.appendChild(payBtn);
    }
    if (status === "paid") {
      const payedBtn = document.createElement("button");
      payedBtn.className = "btn btn-sm btn-secondary";
      payedBtn.textContent = "waiting report";
      actionsDiv.appendChild(payedBtn);
    }
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(actionsDiv);
    slide.appendChild(card);
    container.appendChild(slide);
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
//  جلب البيانات من الـ API مع التوكين
fetch("https://tamni.vercel.app/api/patient/MyConsultations", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log("API Response:", data.data);
    document.querySelector(".loading-overlay").remove();
    if (data.message && !data.data) {
      document.getElementById(
        "cards-container"
      ).innerHTML = `<div class='alert alert-danger mx-auto text-center'>${data.err}</div>`;
      return;
    }

    // الاستشارات فعليًا موجودة في data.data
    consultations = Array.isArray(data.data) ? data.data : [];
    renderConsultations(consultations);
  })
  .catch((err) => {
    document.querySelector(".loading-overlay").remove();
    console.error("API Error:", err);
    document.getElementById(
      "cards-container"
    ).innerHTML = `<div class='alert alert-danger text-center'>فشل الاتصال بالخادم.</div>`;
  });

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
function payForConsultation(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً!");
    return;
  }
  payConsultation(id, token)
    .then((data) => {
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
      method: "POST",
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
function deleteConsultation(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً!");
    return;
  }
  if (!confirm("هل أنت متأكد أنك تريد حذف الاستشارة؟")) return;
  deleteConsultationApi(id, token)
    .then((data) => {
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
        method: "POST",
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
