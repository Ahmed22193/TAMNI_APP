document.getElementById("myForm").addEventListener("submit", handleSubmit);

const firstName = document.getElementById("firstName");
const middleName = document.getElementById("middleName");
const lastName = document.getElementById("lastName");
const government = document.getElementById("government");
const address = document.getElementById("address");
const specialization = document.getElementById("specialization");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const api_message = document.getElementById("api-message");

function validateName(input) {
  const regex = /^[A-Z][a-z]{2,14}$/;
  if (regex.test(input.value.trim())) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}
// ✅ phone
function validateEgyptianPhone(phoneInput) {
  const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (egyptianPhoneRegex.test(phoneInput.value.trim())) {
    phoneInput.classList.add("is-valid");
    phoneInput.classList.remove("is-invalid");
    document.getElementById("error-message").innerText = "";
    return true;
  } else {
    phoneInput.classList.add("is-invalid");
    phoneInput.classList.remove("is-valid");
    document.getElementById("error-message").innerText = "رقم الهاتف غير صحيح";
    return false;
  }
}
// ✅ password
function validatePassword(passInput) {
  if (passInput.value.length >= 6) {
    passInput.classList.add("is-valid");
    passInput.classList.remove("is-invalid");
    return true;
  } else {
    passInput.classList.add("is-invalid");
    passInput.classList.remove("is-valid");
    return false;
  }
}
// ✅ confirmPassword
function validateConfirmPassword(passInput, confirmInput) {
  if (confirmInput.value === passInput.value && confirmInput.value !== "") {
    confirmInput.classList.add("is-valid");
    confirmInput.classList.remove("is-invalid");
    return true;
  } else {
    confirmInput.classList.add("is-invalid");
    confirmInput.classList.remove("is-valid");
    return false;
  }
}

firstName.addEventListener("keyup", () => validateName(firstName));
middleName.addEventListener("keyup", () => validateName(middleName));
lastName.addEventListener("keyup", () => validateName(lastName));
phone.addEventListener("keyup", () => validateEgyptianPhone(phone));
password.addEventListener("keyup", () => validatePassword(password));
confirmPassword.addEventListener("keyup", () =>
  validateConfirmPassword(password, confirmPassword)
);

function handleSubmit(e) {
  e.preventDefault();
  const selectedGender = document.querySelector('input[name="gender"]:checked');

  if (password.value !== confirmPassword.value) {
    document.getElementById("error-message").innerText =
      "كلمة السر غير متطابقة";
    document.getElementById("error-message").style.opacity = 1;
    document.getElementById("error-message").style.transform =
      "translateX(-40px)";
    return;
  }
  document.getElementById("error-message").innerText = "";
  document.getElementById("error-message").style.opacity = 0;

  document.getElementById("submitBtn").innerText = "...جاري الارسال";
  document.getElementById("submitBtn").disabled = true;

  const formData = {
    firstName: firstName.value.trim(),
    middleName: middleName.value.trim(),
    lastName: lastName.value.trim(),
    government: government.value,
    address: address.value.trim(),
    specialest: specialization.value,
    phone: phone.value.trim(),
    password: password.value,
    userType: "DOCTOR",
    gender: selectedGender.value,
  };

  fetch("https://tamni.vercel.app/api/auth/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.err || data.message || data.error || "حدث خطأ في الإرسال";
        throw new Error(errorMsg);
      }
      return data;
    })
    .then((data) => {
      console.log("تم التسجيل بنجاح:", data);
      document.getElementById("submitBtn").innerText = "تم التسجيل بنجاح";
      api_message.innerText =
        "تم تسجيلك بنجاح برجاء الانتظار الى حين قبول تسجيلك";
      api_message.classList.remove("activ-error");
      api_message.classList.add("activ-seccess");
      setTimeout(() => {
        document.getElementById("myForm").reset();
        window.location.href = "login.html"; ///////////
      }, 3000); // بعد 3 ثواني هيروح على صفحة تسجيل الدخول
    })
    .catch((error) => {
      // هنا بتعرض رسالة الخطأ اللي جايه من الـ API، مثلاً "الرقم مسجل بالفعل"
      document.getElementById("submitBtn").innerText = "sign Up";
      document.getElementById("submitBtn").disabled = false;
      api_message.innerText = error.message;
      api_message.classList.remove("activ-seccess");
      api_message.classList.add("activ-error");
    });
}
