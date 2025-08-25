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

/*document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://tamni.vercel.app/api/admin/getStats";
  const TOKEN = localStorage.getItem("token");
  console.log(TOKEN);

  // دالة تجيب الداتا من API
  async function loadStats() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        document.querySelector(".loading-overlay").remove();
        throw new Error("حدث خطأ أثناء الاتصال بالـ API");
      }
      const data = await response.json();
      const users = data.data.users || [];
      const consultations = data.data.consultations || [];

      document.getElementById("allUsers").innerText = users.totalUsers || 0;
      document.getElementById("consultations").innerText =
        consultations.totalConsultations || 0;

      document.getElementById("doctors").innerText = users.doctors || 0;
      document.getElementById("patients").innerText = users.patients || 0;
      document.getElementById("acceptedDoctors").innerText =
        users.acceptedDoctors || 0;
      document.getElementById("waitingDoctors").innerText =
        users.unacceptedDoctors || 0;

      document.getElementById("pending").innerText = consultations.PENDING || 0;
      document.getElementById("accepted").innerText =
        consultations.ACCEPTED || 0;
      document.getElementById("paid").innerText = consultations.PAID || 0;
      document.getElementById("completed").innerText =
        consultations.COMPLETED || 0;
      document.getElementById("rejected").innerText =
        consultations.REJECTED || 0;

      document.querySelector(".loading-overlay").remove();
    } catch (error) {
      console.error("Error:", error);
      document.querySelector(".loading-overlay").remove();
    }
  }

  loadStats();
});
*/

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

async function loadStats() {
  const API_URL = "https://tamni.vercel.app/api/admin/getStats";
  const TOKEN = localStorage.getItem("token");
  const key = "admin-Stats";
  // 1) اعرض الداتا من LocalStorage لو موجودة
  const localData = getFromLocalStorage(key);
  if (localData) {
    displayStats(localData);
  }
  // 2) في الخلفية هات أحدث داتا من الـ API
  try {
    const response = await fetch(API_URL, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      document.querySelector(".loading-overlay").remove();
      throw new Error("حدث خطأ أثناء الاتصال بالـ API");
    }
    const data = await response.json();
    // 3) قارن بين الجديد والقديم، ولو مختلف → خزّن الجديد واعرضه
    if (JSON.stringify(data.data) !== JSON.stringify(localData)) {
      saveToLocalStorage(key, data.data);
      displayStats(data.data);
    }
    document.querySelector(".loading-overlay").remove();
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(".loading-overlay").remove();
  }
}

function displayStats(data) {
  document.getElementById("allUsers").innerText = data.users?.totalUsers || 0;
  document.getElementById("consultations").innerText =
    data.consultations?.totalConsultations || 0;
  document.getElementById("doctors").innerText = data.users?.doctors || 0;
  document.getElementById("patients").innerText = data.users?.patients || 0;
  document.getElementById("acceptedDoctors").innerText =
    data.users?.acceptedDoctors || 0;
  document.getElementById("waitingDoctors").innerText =
    data.users?.unacceptedDoctors || 0;
  document.getElementById("pending").innerText =
    data.consultations?.PENDING || 0;
  document.getElementById("accepted").innerText =
    data.consultations?.ACCEPTED || 0;
  document.getElementById("paid").innerText = data.consultations?.PAID || 0;
  document.getElementById("completed").innerText =
    data.consultations?.COMPLETED || 0;
  document.getElementById("rejected").innerText =
    data.consultations?.REJECTED || 0;
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
});
