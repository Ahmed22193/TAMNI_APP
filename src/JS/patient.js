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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger btn-delete";
    deleteBtn.textContent = "Delete";

    if (status === "rejected" || status === "pending") {
      if (status === "pending") {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-sm btn-warning";
        editBtn.textContent = "edit";
        actionsDiv.appendChild(editBtn);
      }
      //delete
      deleteBtn.onclick = () => {
        consultations = consultations.filter((c) => c._id !== item._id);
        renderConsultations(consultations);
      };
      actionsDiv.appendChild(deleteBtn);
    }
    if (status === "done" || status === "completed") {
      const reportBtn = document.createElement("button");
      reportBtn.className = "btn btn-sm btn-primary btn-report";
      reportBtn.textContent = " View Report";
      actionsDiv.appendChild(reportBtn);
    }
    if (status === "accepted") {
      const payBtn = document.createElement("button");
      payBtn.className = "btn btn-sm btn-success btn-pay";
      payBtn.textContent = "Pay";
      actionsDiv.appendChild(payBtn);
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
    console.error("API Error:", err);
    document.getElementById(
      "cards-container"
    ).innerHTML = `<div class='alert alert-danger text-center'>فشل الاتصال بالخادم.</div>`;
  });
