import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/products`;

// Public requests
export async function getProducts() {
  const response = await fetch(API_URL);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to fetch products."
    );
  }

  return data.products;
}

export async function getProductById(productId) {
  const response = await fetch(`${API_URL}/${productId}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to fetch product."
    );
  }

  return data.product;
}

// Helper: send the saved authentication token
function getAuthHeaders(includeJson = false) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error(
      "Authentication required. Please log in again."
    );
  }

  return {
    ...(includeJson && {
      "Content-Type": "application/json",
    }),
    Authorization: `Bearer ${token}`,
  };
}

// Create product
export async function createProduct(productData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to create product."
    );
  }

  return data.product;
}

// Update product
export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update product."
    );
  }

  return data.product;
}

// Delete product
export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to delete product."
    );
  }

  return data;
}