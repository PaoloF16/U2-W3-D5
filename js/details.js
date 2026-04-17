const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZTFhYzczOWY4NzAwMTU3YWIwODgiLCJpYXQiOjE3NzY0MTEwNTIsImV4cCI6MTc3NzYyMDY1Mn0.TlevMKTw6sR2qLolKy_AF0czZscRN7wRkVPwPX79Vq4";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const detailContainer = document.getElementById("detailContainer");
const detailSpinner = document.getElementById("detailSpinner");
const detailError = document.getElementById("detailError");

const showSpinner = () => detailSpinner.classList.remove("d-none");
const hideSpinner = () => detailSpinner.classList.add("d-none");

const showError = (message) => {
  detailError.innerHTML = `<div class="alert alert-danger">${message}</div>`;
};

const getProductDetail = () => {
  if (!productId) {
    showError("No se encontró el id del producto.");
    return;
  }

  showSpinner();

  fetch(apiUrl + productId, {
    headers: {
      Authorization: apiKey
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el detalle del producto.");
      }
      return response.json();
    })
    .then((product) => {
      detailContainer.innerHTML = `
        <div class="card shadow-sm">
          <img
            src="${product.imageUrl}"
            class="card-img-top"
            alt="${product.name}"
            style="max-height: 450px; object-fit: cover;"
          >
          <div class="card-body">
            <h1>${product.name}</h1>
            <p class="lead">${product.description}</p>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <a href="./Backoffice.html?id=${product._id}" class="btn btn-warning">Modificar</a>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error(err);
      showError(err.message);
    })
    .finally(() => {
      hideSpinner();
    });
};

getProductDetail();