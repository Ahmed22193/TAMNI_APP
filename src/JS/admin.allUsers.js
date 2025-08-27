const userTableBody = document.getElementById("userTableBody");
let allUsers = [];
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
//activeReload();
function NoData() {
  userTableBody.innerHTML = `
    <tr>
        <td colspan="7" class="text-center">
        <iframe 
            src="https://lottie.host/embed/94c24c1c-f68a-4a62-99e6-f5d14bb37f04/MBHNcShOmq.lottie" 
            style="width:100%; height:300px; border:none;">
        </iframe>
        </td>
    </tr>
    `;
}
// هنا دالة فيها المحتوي بتاع كل اليوزر
let displayUsers = function (arr) {
  userTableBody.innerHTML = "";
  arr.forEach((user, index) => {
    let userName = `${user.firstName}  ${user.middleName} ${user.lastName}`;
    const row = document.createElement("tr");
    row.classList.add("fade"); // opacity 0 في الأول

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td data-label="Name">${userName}</td>
      <td data-label="Phone">${user.phone || "N/A"}</td>
      <td data-label="Status">${
        user.acceptTerms
          ? `<p class="text-success">Accepted</p>`
          : `<p class="text-warning">Pending</p>`
      }</td>
      <td data-label="Role">${user.userType || "User"}</td>
      <td data-label="Date">${new Date(
        user.createdAt
      ).toLocaleDateString()}</td>
      <td class="text-center">
        ${
          user.userType === "ADMIN" || user.userType === "PATIENT"
            ? ""
            : `
            ${
              user.acceptTerms === true
                ? `<button id="deactiv-btn" onclick="deactivateUser('${user._id}')" class="btn btn-sm btn-warning text-white">
                    <i class="fa-solid fa-xmark"></i>
                </button>`
                : `
                <button id="activ-btn" onclick="activateUser('${user._id}')" class="btn btn-sm btn-success text-white">
                    <i class="fa-solid fa-check"></i>
                </button>
                `
            }
            `
        }
        ${
          user.userType === "ADMIN"
            ? "👑"
            : `<button id="delete-btn" onclick="deleteUser('${user._id}')" class="btn btn-sm btn-danger text-white">
          <i class="fa-solid fa-trash"></i>
        </button>`
        }
        
      </td>
  `;
    userTableBody.appendChild(row);

    // أدي فرصة صغيرة وبعدها ضيف show عشان الترانزيشن يشتغل
    setTimeout(() => {
      row.classList.add("show");
    }, 100);
  });
};

/* fetch("https://tamni.vercel.app/api/admin/getAllUsers", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => {
    if (
      response.status === 404 ||
      response.status === 401 ||
      response.status === 500
    ) {
      NoData();
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const users = data.data;
    allUsers.push(...users);
    console.log(allUsers);
    displayUsers(users);
    document.querySelector(".loading-overlay").remove();
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
    document.querySelector(".loading-overlay")?.remove();
  });
 */

function activateUser(userId) {
  const confirmActivate = confirm(
    "Are you sure you want to activate this user?"
  );
  if (confirmActivate) {
    activeReload();
    fetch("https://tamni.vercel.app/api/admin/UpdateDoctor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ doctorId: userId, acceptTerms: true }),
    })
      .then((response) => {
        if (response.ok) {
          document.querySelector(".loading-overlay").remove();
          window.location.reload();
        } else {
          alert("Error activating user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function deactivateUser(userId) {
  const confirmDeactivate = confirm(
    "Are you sure you want to `BLOCK` this user?"
  );
  if (confirmDeactivate) {
    activeReload();
    fetch("https://tamni.vercel.app/api/admin/UpdateDoctor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ doctorId: userId, acceptTerms: false }),
    })
      .then((response) => {
        if (response.ok) {
          document.querySelector(".loading-overlay").remove();
          window.location.reload();
        } else {
          alert("Error deactivating user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function deleteUser(userId) {
  const confirmDelete = prompt("Enter `DELETE` to confirm Deletion");
  if (confirmDelete === "DELETE") {
    activeReload();
    fetch("https://tamni.vercel.app/api/admin/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => {
        if (response.ok) {
          document.querySelector(".loading-overlay").remove();
          window.location.reload();
        } else {
          alert("Error deleting user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Deletion cancelled");
  }
}

/* ------------------------------------------ */
/* ------------------------------------------ */
/* ------------------------------------------ */
/* ------------------------------------------ */
/* ------------------------------------------ */

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
async function fetchAllUsers() {
  const key = "admin-AllUsers";
  // 1) عرض البيانات من LocalStorage لو موجودة
  const localData = getFromLocalStorage(key);
  if (localData) {
    displayUsers(localData);
  }
  // 2) في الخلفية: هات بيانات جديدة من API
  try {
    const res = await fetch("https://tamni.vercel.app/api/admin/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.status === 404 || res.status === 401 || res.status === 500) {
      NoData();
      throw new Error("Network response was not ok");
    }
    const apiData = await res.json();

    allUsers = apiData.data; // >> باخد كل الداتا بتاعة اليوزرس علشان اعمل فلتر عليهم

    // 3) لو البيانات الجديدة مختلفة عن المخزنة → حدث
    if (JSON.stringify(apiData.data) !== JSON.stringify(localData)) {
      saveToLocalStorage(key, apiData.data);
      displayUsers(apiData.data); // اعرض الجديد
    }
  } catch (err) {
    console.error("Error fetching doctors:", err);
  }
}
fetchAllUsers();

//------------------------------------------------------
//--------------------------users_filter----------------
//------------------------------------------------------
const UsersSearchBtn = document.getElementById("UsersSearchBtn");
const users_filter = document.getElementById("users_filter");
const searchBar = document.getElementById("searchBar");

UsersSearchBtn.addEventListener("click", () => {
  const searchTerm = searchBar.value;
  const selectedRole = users_filter.value;
  UsersSearchBtn.style.cursor = "pointer";

  if (searchTerm !== `` || selectedRole !== ``) {
    if (searchTerm !== `` && selectedRole !== ``) {
      UsersSearchBtn.style.cursor = "not-allowed";
      return;
    }
    if (searchTerm === `` && selectedRole === `AllUsers`) {
      allUsers.length === 0 ? NoData() : displayUsers(allUsers);
      return;
    }
    if (searchTerm === `` && selectedRole === `doctors`) {
      const doctors = allUsers.filter((user) => user.userType === "DOCTOR");
      doctors.length === 0 ? NoData() : displayUsers(doctors);
      return;
    }
    if (searchTerm === `` && selectedRole === `active_doctors`) {
      const doctors = allUsers.filter(
        (user) => user.userType === "DOCTOR" && user.acceptTerms === true
      );
      doctors.length === 0 ? NoData() : displayUsers(doctors);
      return;
    }
    if (searchTerm === `` && selectedRole === `waiting_doctors`) {
      const doctors = allUsers.filter(
        (user) => user.userType === "DOCTOR" && user.acceptTerms === false
      );
      doctors.length === 0 ? NoData() : displayUsers(doctors);
      return;
    }
    if (searchTerm === `` && selectedRole === `patients`) {
      const patients = allUsers.filter((user) => user.userType === "PATIENT");
      patients.length === 0 ? NoData() : displayUsers(patients);
      return;
    }
    if (searchTerm === `` && selectedRole === `admin`) {
      const admins = allUsers.filter((user) => user.userType === "ADMIN");
      admins.length === 0 ? NoData() : displayUsers(admins);
      return;
    } else {
      const filteredUsers = allUsers.filter((user) => {
        let fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      filteredUsers.length === 0 ? NoData() : displayUsers(filteredUsers);
      return;
    }
  } else {
    UsersSearchBtn.style.cursor = "not-allowed";
    return;
  }
});