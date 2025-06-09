const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("success to connect authRoute...");
});

router.post("/register", async (req, res) => {
  //check if data 符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email 註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email 已被註冊過");

  //製作新用戶
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "register is successful...",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法註冊user...");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) return res.status(401).send("can not find user_email");

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      //create json web token
      const tokenObj = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
      return res.send({
        message: "login success",
        token: "JWT " + token,
        user: foundUser,
      });
      // "JWT "一定要空格
    } else {
      return res.status(401).send("password is wrong");
    }
  });
});

module.exports = router;
