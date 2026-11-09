
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  LogIn,
  UserRound,
  LogOut,
  UserPlus,
  Home as HomeIcon,
  Shirt,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="store-navbar">
      <div className="store-navbar-inner">
        {/* Brand and desktop navigation */}
        <div className="store-navbar-left">
          <Link
            to="/"
            className="store-brand"
            onClick={closeMenu}
          >
            OneNO
          </Link>

          <div className="store-desktop-links">
            <Link to="/">
              <HomeIcon size={17} strokeWidth={1.8} />
              <span>Home</span>
            </Link>

            <Link to="/products">
              <Shirt size={17} strokeWidth={1.8} />
              <span>Products</span>
            </Link>
          </div>
        </div>

        {/* Desktop right-side links */}
        <div className="store-desktop-right">
          {/* Admin Dashboard link */}
          {!isLoading &&
            isAuthenticated &&
            user?.role === "admin" && (
              <Link
                to="/admin"
                className="store-icon-link"
              >
                <UserRound size={18} strokeWidth={1.8} />
                <span>Admin Dashboard</span>
              </Link>
            )}

          <Link to="/cart" className="store-icon-link">
            <ShoppingCart size={19} strokeWidth={1.8} />
            <span>Cart</span>
          </Link>

          {isLoading ? (
            <span className="store-nav-loading">
              Loading...
            </span>
          ) : isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="store-icon-link"
              >
                <UserRound size={18} strokeWidth={1.8} />
                <span>Hi, {user.name}</span>
              </Link>

              <button
                type="button"
                className="store-logout-button store-icon-link"
                onClick={handleLogout}
              >
                <LogOut size={18} strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="store-icon-link"
              >
                <LogIn size={18} strokeWidth={1.8} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="store-icon-link store-register-link"
              >
                <UserPlus size={18} strokeWidth={1.8} />
                <span>Create account</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="store-menu-toggle"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="store-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X size={25} strokeWidth={1.8} />
          ) : (
            <Menu size={25} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        id="store-mobile-menu"
        className={`store-mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {/* Admin Dashboard link for mobile */}
        {!isLoading &&
          isAuthenticated &&
          user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <UserRound size={19} strokeWidth={1.8} />
              <span>Admin Dashboard</span>
            </Link>
          )}

        <Link
          to="/"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <HomeIcon size={19} strokeWidth={1.8} />
          <span>Home</span>
        </Link>

        <Link
          to="/products"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <Shirt size={19} strokeWidth={1.8} />
          <span>Products</span>
        </Link>

        <Link
          to="/cart"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <ShoppingCart size={19} strokeWidth={1.8} />
          <span>Cart</span>
        </Link>

        {isLoading ? (
          <span className="store-nav-loading">
            Loading...
          </span>
        ) : isAuthenticated ? (
          <>
            <Link
              to="/account"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <UserRound size={19} strokeWidth={1.8} />
              <span>My Account ({user.name})</span>
            </Link>

            <button
              type="button"
              className="store-mobile-logout"
              onClick={handleLogout}
              tabIndex={menuOpen ? 0 : -1}
            >
              <LogOut size={19} strokeWidth={1.8} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <LogIn size={19} strokeWidth={1.8} />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <UserPlus size={19} strokeWidth={1.8} />
              <span>Create account</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
