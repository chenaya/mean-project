import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功，將導向至首頁");
    setCurrentUser(null);
  };
  const handleCollapse = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse.classList.contains("show")) {
      new window.bootstrap.Collapse(navbarCollapse).hide();
    }
  };

  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="/"
                    onClick={handleCollapse}
                  >
                    首頁
                  </Link>
                </li>
                {!currentUser && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/register"
                      onClick={handleCollapse}
                    >
                      註冊會員
                    </Link>
                  </li>
                )}
                {!currentUser && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login"
                      onClick={handleCollapse}
                    >
                      會員登入
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link onClick={handleLogout} className="nav-link" to="/">
                      登出
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/profile"
                      onClick={handleCollapse}
                    >
                      個人頁面
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/course"
                      onClick={handleCollapse}
                    >
                      課程頁面
                    </Link>
                  </li>
                )}
                {currentUser && currentUser.user.role === "instructor" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/postCourse"
                      onClick={handleCollapse}
                    >
                      新增課程
                    </Link>
                  </li>
                )}
                {currentUser && currentUser.user.role === "student" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/enroll"
                      onClick={handleCollapse}
                    >
                      註冊課程
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
