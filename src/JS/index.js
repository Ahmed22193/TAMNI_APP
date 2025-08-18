const token = localStorage.getItem("token");

const welcomeMessage = document.getElementById("welcomeMessage");
const createProfileBtn = document.getElementById("createProfileBtn");
const loginBtn = document.getElementById("loginBtn");

// detect local env including 127.0.0.1, localhost, and file://
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

function logout() {
  const confirmLogout = prompt("Enter 'logout' to confirm logout");
  if (confirmLogout === "logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    renderNavbar();
    window.location.reload();
  }
}

function checkTokenExpiry() {
  if (!token) return;
  const decoded = parseJwt(token);
  if (!decoded?.exp) return;
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > decoded.exp) {
    console.log("🔴 التوكين انتهى");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    renderNavbar();
  }
}

function renderNavbar() {
  const navbarLinks = document.getElementById("navbarLinks");
  if (!navbarLinks) return; // لو الصفحة مفيهاش Navbar

  const token = localStorage.getItem("token");
  let linksHtml = "";

  if (token) {
    const userData = parseJwt(token);
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log(userData);

    if (createProfileBtn) createProfileBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (welcomeMessage) {
      welcomeMessage.innerHTML = `مرحبا, <span>${
        userData?.name || "User"
      }</span> !`;
      welcomeMessage.classList.add("welcome-message");
    }
    if (userData?.role === "ADMIN") {
      linksHtml = `
        <li><a class="a_link" href="/index.html">Home</a></li>
        <li><a class="a_link" href="/src/pages/admin/AllUsers.html">Users</a></li>
        <li><a class="a_link" href="/src/pages/admin/AllConsultations.html">Consultations</a></li>
        <li><a class="a_link" href="/src/pages/admin/status.html">Status</a></li>
        <li><a class="a_link" href="#" onclick="logout()">Logout</a></li>
      `;
    } else if (userData?.userType === "DOCTOR") {
      linksHtml = `
        <li><a class="a_link" href="/index.html">Home</a></li>
        <li><a class="a_link" href="/src/pages/AllDoctors.html">Doctors</a></li>
        <li><a class="a_link" href="/src/pages/doctor/ConsultationsOrder.html">Consultations</a></li>
        <li><a class="a_link" href="#" onclick="logout()">Logout</a></li>
      `;
    } else {
      linksHtml = `
        <li><a class="a_link" href="/index.html">Home</a></li>
        <li><a class="a_link" href="/src/pages/AllDoctors.html">Doctors</a></li>
        <li><a class="a_link" href="/src/pages/patient/MyCosultations.html">Consultations</a></li>
        <li><a class="a_link" href="#" onclick="logout()">Logout</a></li>
      `;
    }
  } else {
    linksHtml = `
      <li><a class="a_link" href="/index.html">Home</a></li>
      <li><a class="a_link" href="/src/pages/AllDoctors.html">Doctors</a></li>
      <li><a class="a_link" href="/src/pages/Auth/login.html">Login</a></li>
      <li><a class="a_link" href="/src/pages/patientOrDoctor.html">Register</a></li>
    `;
  }
  navbarLinks.innerHTML = linksHtml;
}
checkTokenExpiry();
renderNavbar();

const menuToggle = document.getElementById("menuToggle");
const navbarLinks = document.getElementById("navbarLinks");

menuToggle.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});
