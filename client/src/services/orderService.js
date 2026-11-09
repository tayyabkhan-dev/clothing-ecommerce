
const API_URL = "http://localhost:5000/api/orders";

// Read the saved authentication token.
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error(
      "Authentication required. Please log in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Safely read API responses.
async function readResponse(response) {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Request failed."
    );
  }

  return data;
}

// Get all orders (admin).
export async function getOrders() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await readResponse(response);
  return data.orders;
}

// Update order status (admin).
export async function updateOrderStatus(orderId, status) {
  const response = await fetch(
    `${API_URL}/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await readResponse(response);
  return data.order;
}

// Get orders belonging to the logged-in customer.
export async function getMyOrders(token) {
  const response = await fetch(`${API_URL}/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readResponse(response);
}

// Get one order belonging to the logged-in customer.
export async function getMyOrderById(token, orderId) {
  const response = await fetch(
    `${API_URL}/my-orders/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return readResponse(response);
}

// Cancel an order belonging to the logged-in customer.
export async function cancelMyOrder(token, orderId) {
  const response = await fetch(
    `${API_URL}/my-orders/${orderId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return readResponse(response);
}
