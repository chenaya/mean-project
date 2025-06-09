import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CourseService from "../services/courses.service";
//6841340562e692bdadbf8f86 amy
//683e8bf681d8389e75a4f107 ivy

const UpdateCourseComponent = ({ currentUser, setCurrentUser }) => {
  let [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // user自己打在網址的ID
  let [course, setCourse] = useState(location.state?.course || null);
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [courseInstructor, setCourseInstructor] = useState("");

  useEffect(() => {
    if (!course && id) {
      //如果 course 是空的（尚未有課程資料），而 id 是有值的（從網址取得了課程 id）
      // 若沒有從上一頁帶資料過來，就透過 id 去後端撈資料
      CourseService.getCourseById(id)
        .then((res) => {
          try {
            console.log("res.data", res.data);
            setCourse(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setPrice(res.data.price);
            setCourseInstructor(res.data.instructor._id);

            console.log("階段一 end");
          } catch (err) {
            console.error("then 區塊內錯誤：", err);
            setMessage("處理課程資料失敗：" + err.message);
          }
        })
        .catch((err) => {
          setMessage("載入課程資料失敗" + err);
        });
    } else if (course && title === "") {
      // 避免重複設定
      setTitle(course.title);
      setDescription(course.description);
      setPrice(course.price);
      setCourseInstructor(currentUser?.user?._id);
      console.log("使用傳過來的課程資料");
    }
  }, [id, course]);

  useEffect(() => {
    if (!currentUser || !currentUser?.user || !courseInstructor) return;
    if (currentUser?.user?._id !== courseInstructor) {
      return setMessage("必須是此課程的講師才能更新課程...");
    } else {
      setMessage("");
    }
  }, [courseInstructor, currentUser]);

  const updateCourse = () => {
    CourseService.updateCourse(course._id, {
      title,
      description,
      price,
    })
      .then((res) => {
        alert("課程更新成功！");
        navigate("/course");
      })
      .catch((err) => {
        console.log(err);
        setMessage("更新失敗：" + err.response?.data || "未知錯誤");
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {message && (
        <div className="alert alert-warning" role="alert">
          {message}
        </div>
      )}
      {!currentUser && (
        <div>
          <p>使用此功能，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}

      {currentUser?.user?._id === courseInstructor && (
        <div className="form-group">
          <label for="updateforTitle">課程標題：</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="updateforTitle"
            placeholder={title}
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label for="updateforContent">內容：</label>
          <textarea
            className="form-control"
            id="updateforContent"
            aria-describedby="emailHelp"
            name="content"
            placeholder={description}
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <label for="updateforPrice">價格：</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="updateforPrice"
            placeholder={price}
            value={price || ""}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
          <button className="btn btn-primary" onClick={updateCourse}>
            確認更新課程
          </button>
          <br />
          <br />
        </div>
      )}
    </div>
  );
};

export default UpdateCourseComponent;
