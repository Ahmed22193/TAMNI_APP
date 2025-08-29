api_message = document.getElementById("api_message");

mainComplaint = document.getElementById("mainComplaint");
currentSymptoms = document.getElementById("currentSymptoms");
duration = document.getElementById("duration");
age = document.getElementById("age");
type = document.getElementById("responseType");

let doctorId = "";
// دالة تجيب الـ id من البارام
function getConsultationIdFromParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // بيرجع القيمة بتاعت ?id=xxx
}
 
function fillInputs() {
  const consultationId = getConsultationIdFromParams(); // id من البارام
  const consultations =
    JSON.parse(localStorage.getItem("consultationInfo")) || [];

  // دور على الاستشارة اللي ليها نفس الـ id
  const consult = consultations.find(
    (item) => item.consultationId === consultationId
  );

  if (consult) {
    mainComplaint.value = consult.mainComplaint || "";
    currentSymptoms.value = consult.currentSymptoms || "";
    duration.value = consult.duration || "";
    age.value = consult.age || "";
    type.value = consult.type || "";
    doctorId = consult.doctorId || "";
    console.log("Doctor ID from consultation:", doctorId);
  } else {
    console.log("❌ الاستشارة مش موجودة في localStorage");
  }
}
fillInputs();

document
  .getElementById("consultForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!checkInputs()) {
      return;
    }
    let btn = document.querySelector("button[type=submit]");
    btn.innerHTML = "updating...";
    btn.disabled = true;
    const data = {
      mainComplaint: mainComplaint.value,
      currentSymptoms: currentSymptoms.value,
      duration: duration.value,
      age: age.value,
      type: type.value,
      files: document.getElementById("attachment").files,
      medicalHistory: Array.from(
        document.querySelectorAll("input[type=checkbox]:checked")
      ).map((cb) => cb.value),
    };
    let description = `
      🎂{Age: ${data.age || "Not provided"}}---
      📝{Main Complaint: ${data.mainComplaint}}---
      🤒{Current Symptoms: ${data.currentSymptoms}}---
      ⏳{Duration of Symptoms: ${data.duration}}---
      🏥{Medical History: ${
        data.medicalHistory.length ? data.medicalHistory.join(", ") : "None"
      }}`;

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("doctorId", doctorId);
    formData.append("description", description.trim());
    formData.append(
      "consultationId",
      (consultationId = getConsultationIdFromParams())
    );

    // ✅ استخدم data.files بدل متغير مش متعرف
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }

    try {
      const res = await fetch(
        "https://tamni.vercel.app/api/patient/updateConsultation",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "PATCH",
          body: formData,
        }
      );
      const result = await res.json();
      document.getElementById("consultForm").reset();
      api_message.innerHTML = "✅ Consultation updated successfully!";
      api_message.className = "alert alert-success";
      console.log("API Response:", result);
      btn.innerHTML = "update";
      btn.disabled = false;
      console.log("API Response:", result.data._id);
      saveConsultationInLocalStorage(data, result.data._id, doctorId);
    } catch (error) {
      console.error("Error:", error);
      btn.innerHTML = "update";
      btn.disabled = false;
      api_message.innerHTML = "❌ Failed to update consultation.";
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
  // هات كل الاستشارات اللي متخزنة قبل كده
  let consultationArr =
    JSON.parse(localStorage.getItem("consultationInfo")) || [];

  // شيّل الملفات علشان ما تتخزنش
  const { files, ...restData } = data;

  // جهّز الكائن الجديد
  const consultationInfo = { ...restData, consultationId, doctorId };

  // دور على الاستشارة القديمة بنفس الـ ID
  const existingIndex = consultationArr.findIndex(
    (item) => item.consultationId === consultationId
  );

  if (existingIndex !== -1) {
    // لو موجودة، حدثها
    consultationArr[existingIndex] = consultationInfo;
  } else {
    // لو مش موجودة، ضيفها
    consultationArr.push(consultationInfo);
  }

  // خزّن المصفوفة بعد التعديل
  localStorage.setItem("consultationInfo", JSON.stringify(consultationArr));
}
