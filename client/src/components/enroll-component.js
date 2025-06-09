import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/courses.service";

const EnrollComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setSearchResult(data.data);
        } else {
          alert("無相關課程");
          setSearchResult([]); // 清空搜尋結果
          setSearchInput("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功。重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data); // "你已經註冊過這門課程"
        } else {
          alert(err.response.data); //"發生錯誤，請稍後再試"
        }
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            className="form-control"
            value={searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="輸入關鍵字..."
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length !== 0 && (
        <div>
          <p>我們從 API 返回的數據。</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {searchResult.map((course) => (
              <div key={course._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p>價格: {course.price}</p>
                  <p>目前的學生人數: {course.students.length}</p>
                  <a
                    href="#"
                    onClick={handleEnroll}
                    className="card-text btn btn-primary"
                    id={course._id}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
