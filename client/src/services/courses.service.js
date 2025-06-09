import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";

class CourseService {
  getToken() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return token;
  }

  post(title, description, price) {
    let token = this.getToken();

    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: { Authorization: token },
      }
    );
  }

  getEnrolledCourse(_id) {
    let token = this.getToken();

    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }

  get(_id) {
    let token = this.getToken();

    return axios.get(API_URL + "/instructor/" + _id, {
      headers: { Authorization: token },
    });
  }

  getCourseById(_id) {
    let token = this.getToken();

    return axios.get(API_URL + "/" + _id, {
      headers: { Authorization: token },
    });
  }

  getCourseByName(name) {
    let token = this.getToken();

    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }

  enroll(_id) {
    let token = this.getToken();

    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }

  updateCourse(_id, data) {
    let token = this.getToken();

    // data=>更新後的資料
    return axios.patch(API_URL + "/updateCourse/" + _id, data, {
      headers: { Authorization: token },
    });
  }

  deleteCourse(_id) {
    let token = this.getToken();

    return axios.delete(API_URL + "/" + _id, {
      headers: { Authorization: token },
    });
  }

  unenroll(courseId, studentId) {
    let token = this.getToken();

    return axios.put(
      API_URL + "/unenroll/" + courseId,
      { studentId },
      { headers: { Authorization: token } }
    );
  }
}

export default new CourseService();
