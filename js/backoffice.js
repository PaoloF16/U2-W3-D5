const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZTFhYzczOWY4NzAwMTU3YWIwODgiLCJpYXQiOjE3NzY0MTEwNTIsImV4cCI6MTc3NzYyMDY1Mn0.TlevMKTw6sR2qLolKy_AF0czZscRN7wRkVPwPX79Vq4";

/* DOM */
const nameProduct = document.getElementById("nameProduct");
const descriptionProduct = document.getElementById("descriptionProduct");
const priceProduct = document.getElementById("priceProduct");
const urlImgProduct = document.getElementById("urlImgProduct");
const brandProduct = document.getElementById("categoryProduct");

const form = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const deleteBtn = document.getElementById("deleteBtn");
const resetBtn = document.getElementById("resetBtn");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const isEditMode = !!productId;

/* INIT */
window.addEventListener("DOMContentLoaded", () => {
  if (isEditMode) {
    formTitle.textContent = "Edit product";
    submitBtn.textContent = "Update product";
    deleteBtn.classList.remove("d-none");
    getProductDetails(productId);
  } else {
    formTitle.textContent = "Create product";
    submitBtn.textContent = "Create product";
    deleteBtn.classList.add("d-none");
  }
});

/* EVENTS */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  if (isEditMode) {
    updateProduct(productId);
  } else {
    createProduct();
  }
});

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm("Are you sure you want to reset the form?");
  if (confirmReset) {
    form.reset();
  }
});

deleteBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (confirmDelete) {
    deleteProduct(productId);
  }
});

/* HELPERS */
const getProductPayload = () => {
  return {
    name: nameProduct.value.trim(),
    description: descriptionProduct.value.trim(),
    brand: brandProduct.value.trim(),
    price: Number(priceProduct.value),
    imageUrl: urlImgProduct.value.trim()
  };
};

const validateForm = () => {
  const product = getProductPayload();

  if (
    !product.name ||
    !product.description ||
    !product.brand ||
    !product.imageUrl ||
    !product.price
  ) {
    alert("All fields are required");
    return false;
  }

  if (product.price <= 0) {
    alert("Price must be greater than 0");
    return false;
  }

  return true;
};

const fillForm = (product) => {
  nameProduct.value = product.name || "";
  descriptionProduct.value = product.description || "";
  brandProduct.value = product.brand || "";
  priceProduct.value = product.price || "";
  urlImgProduct.value = product.imageUrl || "";
};

/* API CALLS */
const createProduct = async () => {
  const product = getProductPayload();

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    const responseText = await response.text();
    console.log("CREATE STATUS:", response.status);
    console.log("CREATE RESPONSE:", responseText);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }

    const data = responseText ? JSON.parse(responseText) : null;

    alert("Product created successfully");
    console.log("Created:", data);
    form.reset();
  } catch (err) {
    console.error("Error:", err);
    alert(err.message);
  }
};

const getProductDetails = (id) => {
  fetch(apiUrl + id, {
    headers: {
      Authorization: apiKey
    }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error loading product");
      return response.json();
    })
    .then((product) => {
      fillForm(product);
      console.log("Loaded product:", product);
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Could not load product details");
    });
};

const updateProduct = (id) => {
  const product = getProductPayload();

  fetch(apiUrl + id, {
    method: "PUT",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error updating product");
      return response.json();
    })
    .then((data) => {
      alert("Product updated successfully");
      console.log("Updated:", data);
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("There was an error updating the product");
    });
};

const deleteProduct = (id) => {
  fetch(apiUrl + id, {
    method: "DELETE",
    headers: {
      Authorization: apiKey
    }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error deleting product");
      alert("Product deleted successfully");
      window.location.href = "./index.html";
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("There was an error deleting the product");
    });
};