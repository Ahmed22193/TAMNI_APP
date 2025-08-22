
  let cardsContainer = document.getElementById("cardsContainer");

  
  let favorites = JSON.parse(localStorage.getItem("favorites"));
  function renderFavoriteCards() {
    cardsContainer.innerHTML = "";

    if (favorites.length === 0) {
      cardsContainer.innerHTML = `<p class="text-center">لا يوجد دكاترة مفضلين حاليا</p>`;
      return;
    }

    favorites.forEach((doctor, index) => {
      let fullName = `${doctor.firstName} ${doctor.middleName} ${doctor.lastName}`;
      cardsContainer.innerHTML += `
        <div class="col-md-4 col-lg-3 mb-4">
          <div class="card">
            <img src="../../src/images/doctor.jpg" class="card-img-top" alt="Doctor" />
            <div class="card-body card-content">
              <h4>Dr : ${fullName}</h4>
              <p>📍 ${doctor.government} : ${doctor.address}<br />
                <span>${doctor.specialest}</span>
              </p>
              <button class="btn btn-danger w-100" onclick="removeFromFavorites('${doctor._id}')">
                Delete from Favorite
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }


  function removeFromFavorites(doctorId) {
    favorites = favorites.filter((doc) => doc._id !== doctorId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavoriteCards();

  
  renderFavoriteCards();
  }

