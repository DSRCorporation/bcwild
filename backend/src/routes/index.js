const router = require("express").Router();
router.use("/user", require("./user"));
router.use("/admin", require("./admin"));
router.use("/", require("./forgetPassword"));
router.use("/", require("./project"));
router.use("/", require("./sync"));
router.use("/", require("./export"));

module.exports = router;
