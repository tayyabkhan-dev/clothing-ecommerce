
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNav from "./components/AdminNav";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderReview from "./pages/OrderReview";
import OrderConfirmation from "./pages/OrderConfirmation";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import MyOrders from "./pages/MyOrders";
import MyOrderDetails from "./pages/MyOrderDetails";

import About from "./pages/About";
import Contact from "./pages/Contact";

import ShippingDelivery from "./pages/ShippingDelivery";
import ReturnPolicy from "./pages/ReturnPolicy";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";

// Customer pages par footer show hoga.
// Admin pages par footer hide rahega.
function CustomerFooter() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* CUSTOMER PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-review"
          element={<OrderReview />}
        />
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        {/* ABOUT AND CONTACT */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* STORE POLICY PAGES */}
        <Route
          path="/shipping-delivery"
          element={<ShippingDelivery />}
        />
        <Route
          path="/return-policy"
          element={<ReturnPolicy />}
        />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route path="/terms" element={<Terms />} />

        {/* CUSTOMER AUTHENTICATION */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* CUSTOMER ACCOUNT */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER ORDERS */}
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <ProtectedRoute>
              <MyOrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <>
                <AdminNav />
                <AdminDashboard />
              </>
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <>
                <AdminNav />
                <AdminProducts />
              </>
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <>
                <AdminNav />
                <AdminOrders />
              </>
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN ORDER DETAILS */}
        <Route
          path="/admin/orders/:id"
          element={
            <AdminProtectedRoute>
              <>
                <AdminNav />
                <AdminOrderDetails />
              </>
            </AdminProtectedRoute>
          }
        />
      </Routes>

      <CustomerFooter />
    </BrowserRouter>
  );
}

export default App;
