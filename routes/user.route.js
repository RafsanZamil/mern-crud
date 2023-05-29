const express =require("express");
const router = express.Router();
const {getAllUser, createUser,deleteUser,updateUser,getOneUser} = require("../controllers/user.controller")

router.get("/", getAllUser);
router.get("/:id", getOneUser);
router.post("/", createUser);
router.delete('/:id',deleteUser);
router.patch("/:id", updateUser);



module.exports = router;