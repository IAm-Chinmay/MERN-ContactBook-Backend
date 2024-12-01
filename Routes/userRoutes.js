const express = require("express");
const router = express.Router();

const {
  addContact,
  deleteContact,
  editContact,
  loginUser,
  registerUser,
  getContacts,
} = require("../Controller/userController");
const authMiddleware = require("../jwtmiddleware");

router.get("/", authMiddleware, getContacts);
router.post("/add-contact", authMiddleware, addContact);
router.delete("/delete-contact/:contactId", authMiddleware, deleteContact);
router.put("/edit-contact/:contactId", authMiddleware, editContact);
router.post("/login-user", loginUser);
router.post("/register-user", registerUser);

module.exports = router;
