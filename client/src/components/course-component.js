import React from "react";
import { useState, useEffect } from "react";
import CourseService from "../services/courses.service";
import { useNavigate } from "react-router-dom";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const hadleTakeToLogin = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);
  const handleDelete = (id) => {
    if (!window.confirm("確定要刪除這門課程嗎？")) return;
    CourseService.deleteCourse(id)
      .then((res) => {
        alert("課程已刪除！");
        // 目前的課程資料中移除被刪除的課程=>更新畫面
        setCourseData(
          (prevData) => prevData.filter((course) => course._id !== id) // 會保留所有 _id 不等於刪除目標 id 的課程
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(courseData);

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "student") {
        console.log("student...");
        CourseService.getEnrolledCourse(_id)
          .then((data) => {
            console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>需先登入才能看到課程...</p>
          <button className="btn btn-primary btn-lg" onClick={hadleTakeToLogin}>
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>歡迎來到講師課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>歡迎來到學生課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數：{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格：{course.price}
                  </p>
                  {currentUser && currentUser.user.role === "instructor" && (
                    <button
                      onClick={() => {
                        navigate(`/updateCourse/${course._id}`, {
                          state: { course }, // 傳整個課程資料
                        });
                      }}
                      className="btn btn-primary"
                      style={{ marginRight: "0.8rem" }}
                    >
                      <span>更改課程</span>
                    </button>
                  )}
                  {currentUser && currentUser.user.role === "instructor" && (
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="btn btn-primary"
                    >
                      <span>刪除課程</span>
                    </button>
                  )}
                  {currentUser && currentUser.user.role === "student" && (
                    <button
                      onClick={() => {
                        CourseService.unenroll(course._id, currentUser.user._id)
                          .then((res) => {
                            alert("取消註冊成功！");
                            setCourseData((prevCourses) =>
                              prevCourses.filter((c) => c._id !== course._id)
                            );
                          })
                          .catch((err) => {
                            console.error(err);
                            alert("取消失敗");
                          });
                      }}
                      className="btn btn-primary"
                    >
                      <span>取消註冊課程</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
