const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  next();
});

// get all courses
router.get("/", async (req, res) => {
  // populate => query obj (thenable obj)
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// unenroll course
router.put("/unenroll/:_course_id", async (req, res) => {
  let { _course_id } = req.params;
  let { studentId } = req.body;

  try {
    let updatedCourse = await Course.findByIdAndUpdate(
      _course_id,
      { $pull: { students: studentId } }, // 從陣列移除該學生 ID
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).send({ message: "找不到課程" });
    }

    return res.send({ message: "已取消註冊", course: updatedCourse });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "取消註冊失敗", error: err.message });
  }
});

// use instructor_id to search course
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// use student_id to search course
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();

  return res.send(coursesFound);
});

// use course_name to search course
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({
      title: { $regex: name, $options: "i" }, //模糊搜尋
    })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// use course_id to search course
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findById(_id)
      .populate("instructor", ["username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//create new course
router.post("/", async (req, res) => {
  //驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師才能發布新課程");
  }

  let { title, description, price } = req.body;

  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    await newCourse.save();
    return res.send("成功創建新課程");
  } catch (e) {
    return res.status(500).send("無法創建新課程...");
  }
});

// enroll course
router.post("/enroll/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let course = await Course.findOne({ _id });
    // 驗證是否已註冊過
    if (course.students.includes(req.user._id)) {
      return res.status(400).send("你已經註冊過這門課程");
    }
    // 加入學生
    course.students.push(req.user._id);
    await course.save();
    res.send("註冊完成");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// update course data
router.patch("/updateCourse/:_id", async (req, res) => {
  //驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // check course exist
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新...");
    }

    // user 必須是此課程的講師
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        msg: "課程更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("必須是此課程的講師才能更新課程...");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // check course exist
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除...");
    }

    // user 必須是此課程的講師
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程刪除成功");
    } else {
      return res.status(403).send("必須是此課程的講師才能刪除課程...");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
