const router = require("express").Router();
router.use("/user", require("./user"));
router.use("/admin", require("./admin"));
router.use("/", require("./forgetPassword"));
router.use("/", require("./project"));
router.use("/", require("./sync"));
router.use("/", require("./export"));
router.use("/bridge", require("./bridge"));
router.use("/animal", require("./animal"));
router.use("/image", require("./image"));
router.use("/profileimage", require("./profileImage"));

module.exports = router;
