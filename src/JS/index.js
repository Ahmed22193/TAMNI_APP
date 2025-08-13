const token = localStorage.getItem("token");

const welcomeMessage = document.getElementById("welcomeMessage");
const createProfileBtn = document.getElementById("createProfileBtn");
const loginBtn = document.getElementById("loginBtn");
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1]; // ناخد الـ payload
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
  }
}
function checkTokenExpiry() {
  if (!token) return;

  const decoded = parseJwt(token);
  if (!decoded?.exp) return;
  const currentTime = Math.floor(Date.now() / 1000); // الوقت الحالي بالثواني

  if (currentTime > decoded.exp) {
    console.log("🔴 التوكين انتهى");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    renderNavbar(); // إعادة بناء النافبار كزائر
  }
}
function renderNavbar() {
  const navbarLinks = document.getElementById("navbarLinks");
  const token = localStorage.getItem("token");
  let linksHtml = "";

  // لو فيه توكين
  if (token) {
    const userData = parseJwt(token);
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log(userData);

    [createProfileBtn, loginBtn].forEach((btn) => {
      btn.style.display = "none";
    });
    welcomeMessage.innerHTML = `مرحبا, <span>${
      userData?.name || "User"
    }</span> !`;
    welcomeMessage.classList.add("welcome-message");

    if (userData?.role === "admin") {
      linksHtml = `
                <li><a class="a_link" href="../../../index.html">Home</a></li>
                <li><a class="a_link" href="src/pages/AllDoctors.html">Doctors</a></li>
                <li><a class="a_link" href="src/pages/doctor/ConsultationsOrder.html">My Consultations</a></li>
                <li><a class="a_link" href="src/pages/admin/Dashboard.html">Dashboard</a></li>
                <li><a class="a_link" href="#" onclick="logout()">Logout</a></li>
            `;
    } else {
      linksHtml = `
                <li><a class="a_link" href="../../../index.html">Home</a></li>
                <li><a class="a_link" href="src/pages/AllDoctors.html">Doctors</a></li>
                <li><a class="a_link" href="src/pages/doctor/ConsultationsOrder.html">My Consultations</a></li>
                <li><a class="a_link" href="#" onclick="logout()">Logout</a></li>
            `;
    }
  }
  // لو مفيش توكين (زائر)
  else {
    linksHtml = `
            <li><a class="a_link" href="../../../index.html">Home</a></li>
            <li><a class="a_link" href="src/pages/AllDoctors.html">Doctors</a></li>
            <li><a class="a_link" href="src/pages/login.html">Login</a></li>
            <li><a class="a_link" href="src/pages/register.html">Register</a></li>
        `;
  }

  navbarLinks.innerHTML = linksHtml;
}
checkTokenExpiry();
renderNavbar();
