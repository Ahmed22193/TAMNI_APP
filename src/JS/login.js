document.getElementById("myForm").addEventListener("submit", handleSubmit);
const phone = document.getElementById("Phone");
const password = document.getElementById("Password");

// ✅ phone
function validateEgyptianPhone(phoneInput) {
  const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (egyptianPhoneRegex.test(phoneInput.value)) {
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
phone.addEventListener("keyup", () => validateEgyptianPhone(phone));
password.addEventListener("keyup", () => validatePassword(password));







function handleSubmit(event) {
  event.preventDefault();

  if (
    phone.classList.contains("is-valid") &&
    password.classList.contains("is-valid")
  ) {
    const btnSubmit = document.getElementById("btn-sub");
    btnSubmit.innerHTML = `Loading...`;
    btnSubmit.disabled = true;

    const message = document.getElementById("message");
    message.innerHTML = ``;
    const formData = {
      phone: phone.value,
      password: password.value,
    };

    fetch("https://tamni.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          btnSubmit.innerHTML = `Done`;
          message.innerHTML = `login successful! Redirecting...`;
          message.style.background = "white";
          message.style.color = "green";
          setTimeout(() => {
            window.location.href = `../../../index.html`;
          }, 1500);
        } else if (response.status === 401) {
          btnSubmit.innerHTML = `submit`;
          btnSubmit.disabled = false;
          message.innerHTML = `Invalid phone or password. Please try again.`;
        } else if (response.status === 404) {
          message.style.background = "white";
          message.style.color = "red";
          message.innerHTML = `User not found. Please check your phone number.`;
          btnSubmit.innerHTML = `submit`;
          btnSubmit.disabled = false;
        } else {
          message.style.background = "white";
          message.style.color = "red";
          message.innerHTML = `Unexpected error occurred. Please try again later.`;
          throw new Error("Unexpected response status: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        const token = data.data;
        if (token !== null && token !== undefined && token !== "") {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    message.innerHTML = ``;
    message.innerHTML = `please enter the true phone and min password 6`;
  }
}
