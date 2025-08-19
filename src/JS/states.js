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

document.addEventListener("DOMContentLoaded", () => {
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
