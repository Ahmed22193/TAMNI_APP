const apiURL = "https://tamni.vercel.app/api/doctor/Doctors";

fetch(apiURL)
  .then(response => {
    if (!response.ok) {
      throw new Error("حدث خطأ في الطلب: " + response.status);
    }
    return response.json(); 
  })
  .then(data => {
    console.log("البيانات الراجعة:", data); 

    
    const container = document.getElementById("doctorsList");
    data.forEach(doctor => {
      const div = document.createElement("div");
      div.textContent = doctor.name; 
      container.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Error:", error);
  });
