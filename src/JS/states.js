
  document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://tamni.vercel.app/api/admin/getStats";
    const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODljZmQ2NDE4YmEzN2ZhYzMyMmI2N2MiLCJ1c2VyVHlwZSI6IkFETUlOIiwicm9sZSI6IkFETUlOIiwibmFtZSI6IkFobWVkIEhtYWRhIiwiaWF0IjoxNzU1NDYxNzE3LCJleHAiOjE3NTU1NDgxMTd9._9UAxlg4zvyUTFEUH-JPKrqKZ3XncNVrQlpwUYKNtKA";

    // دالة تجيب الداتا من API
    async function loadStats() {
      try {
        const response = await fetch(API_URL, {
          headers: {
            "Authorization": TOKEN,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("حدث خطأ أثناء الاتصال بالـ API");
        }

        const data = await response.json();
        console.log("API Response:", data);

      
        document.getElementById("allUsers").innerText = data.allUsers || 0;
        document.getElementById("consultations").innerText = data.consultations || 0;

        document.getElementById("doctors").innerText = data.doctors || 0;
        document.getElementById("patients").innerText = data.patients || 0;
        document.getElementById("acceptedDoctors").innerText = data.acceptedDoctors || 0;
        document.getElementById("waitingDoctors").innerText = data.waitingDoctors || 0;

        document.getElementById("pending").innerText = data.pendingConsultations || 0;
        document.getElementById("accepted").innerText = data.acceptedConsultations || 0;
        document.getElementById("paid").innerText = data.paidConsultations || 0;
        document.getElementById("completed").innerText = data.completedConsultations || 0;

      } catch (error) {
        console.error("Error:", error);
      }
    }

    loadStats();
  });
