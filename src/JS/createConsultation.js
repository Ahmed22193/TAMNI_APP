api_message = document.getElementById("api_message");

mainComplaint = document.getElementById("mainComplaint");
currentSymptoms = document.getElementById("currentSymptoms");
duration = document.getElementById("duration");
age = document.getElementById("age");
type = document.getElementById("responseType"); 
const params = new URLSearchParams(window.location.search);

document
  .getElementById("consultForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!checkInputs()) {
      return;
    }
    let btn = document.querySelector("button[type=submit]");
    btn.innerHTML = "sending...";
    btn.disabled = true;

    const doctorId = params.get("doctorId");
    console.log("Doctor ID from params:", doctorId);
    const data = {
      mainComplaint: mainComplaint.value,
      currentSymptoms: currentSymptoms.value,
      duration: duration.value,
      age: age.value,
      type: type.value, // غيرت اسمها لـ type زي المطلوب في الـ API
      files: document.getElementById("attachment").files,
      medicalHistory: Array.from(
        document.querySelectorAll("input[type=checkbox]:checked")
      ).map((cb) => cb.value),
    };

    let description = `
--- Consultation Form ---
📝 Main Complaint: ${data.mainComplaint}
🤒 Current Symptoms: ${data.currentSymptoms}
⏳ Duration of Symptoms: ${data.duration}
🎂 Age: ${data.age || "Not provided"}
📞 Response Type: ${data.type}
🏥 Medical History: ${
      data.medicalHistory.length ? data.medicalHistory.join(", ") : "None"
    }
---------------------------
`;

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("doctorId", doctorId);
    formData.append("description", description.trim());

    // ✅ استخدم data.files بدل متغير مش متعرف
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }

    try {
      const res = await fetch(
        "https://tamni.vercel.app/api/patient/createConsultation",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      document.getElementById("consultForm").reset();
      api_message.innerHTML = "✅ Consultation sent successfully!";
      api_message.className = "alert alert-success";
      console.log("API Response:", result);
      btn.innerHTML = "Send";
      btn.disabled = false;
      console.log("API Response:", result.data._id);
      saveConsultationInLocalStorage(data, result.data._id, doctorId);
    } catch (error) {
      console.error("Error:", error);
      btn.innerHTML = "Send";
      btn.disabled = false;
      api_message.innerHTML = "❌ Failed to send consultation.";
      api_message.className = "alert alert-danger";
    }
  });

function checkInputs() {
  if (
    mainComplaint.value !== "" &&
    currentSymptoms.value !== "" &&
    duration.value !== "" &&
    age.value !== "" &&
    type.value !== ""
  ) {
    return true;
  }
  api_message.innerHTML = "Please fill in all fields.";
  api_message.className = "alert alert-danger";
  return false;
}

function saveConsultationInLocalStorage(data, consultationId, doctorId) {
  // لو فيه بيانات قديمة في localStorage رجّعها
  let consultationArr =
    JSON.parse(localStorage.getItem("consultationInfo")) || [];
  const { files, ...restData } = data;

  // أنشئ الكائن اللي هتخزّنه
  const consultationInfo = { ...restData, consultationId ,doctorId};

  // ضيف الكائن الجديد في المصفوفة
  consultationArr.push(consultationInfo);

  // خزّن المصفوفة كلها تاني
  localStorage.setItem("consultationInfo", JSON.stringify(consultationArr));
}
