document.getElementById("myForm").addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  const btnSubmit = document.getElementById("btn-sub");
  event.preventDefault();
  btnSubmit.innerHTML = `Loading...`;
  btnSubmit.disabled = true;
  const phone = document.getElementById("Phone").value.trim();
  const password = document.getElementById("Password").value.trim();
  const message = document.getElementById("message");

  const formData = {
    phone,
    password,
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
}
