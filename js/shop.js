const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZTFhYzczOWY4NzAwMTU3YWIwODgiLCJpYXQiOjE3NzY0MTEwNTIsImV4cCI6MTc3NzYyMDY1Mn0.TlevMKTw6sR2qLolKy_AF0czZscRN7wRkVPwPX79Vq4";

/* DOM */
const container = document.getElementById("cards-container");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorBox = document.getElementById("errorBox");

const showSpinner = () => {
  loadingSpinner.classList.remove("d-none");
};

const hideSpinner = () => {
  loadingSpinner.classList.add("d-none");
};

const showError = (message) => {
  errorBox.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
  `;
};

const clearError = () => {
  errorBox.innerHTML = "";
};

const getProduct = () => {
  showSpinner();
  clearError();

  fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: token inválid o expired.");
        }
        if (response.status >= 500) {
          throw new Error("Server error: The products are not charged.");
        }
        throw new Error("Error to fetch the products.");
      }

      return response.json();
    })
    .then((data) => {
      renderCards(data);
    })
    .catch((err) => {
      console.error(err);
      showError(err.message);
    })
    .finally(() => {
      hideSpinner();
    });
};

const renderCards = (products) => {
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          We dont have products to show in this page .
        </div>
      </div>
    `;
    return;
  }

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img
          src="${product.imageUrl}"
          class="card-img-top"
          alt="${product.name}"
          style="height: 250px; object-fit: cover; cursor: pointer;"
          onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'"
          data-id="${product._id}"
        >

        <div class="card-body d-flex flex-column">
          <h5 class="card-title" style="cursor: pointer;" data-id="${product._id}">
            ${product.name}
          </h5>

          <p class="card-text">${product.description}</p>

          <div class="mt-auto">
            <p class="fw-bold mb-3">$${product.price}</p>

            <div class="d-flex gap-2">
              <a href="./detalle.html?id=${product._id}" class="btn btn-primary flex-fill">
                Ver más
              </a>

              <a href="./Backoffice.html?id=${product._id}" class="btn btn-warning flex-fill">
                Modificar
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  addCardNavigation();
};

const addCardNavigation = () => {
  const clickableElements = container.querySelectorAll("[data-id]");

  clickableElements.forEach((element) => {
    element.addEventListener("click", () => {
      const id = element.dataset.id;
      window.location.href = `./detalle.html?id=${id}`;
    });
  });
};

getProduct();
