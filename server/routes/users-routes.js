const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const imageUpload = require('../middleware/image-upload');

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  imageUpload.single('image'),  //! image = the id(or the name) of the input in the front
  [
    check("name").not().isEmpty(),
    // https://github.com/express-validator/express-validator/issues/946
    check("email").normalizeEmail({gmail_remove_dots: false}).isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
