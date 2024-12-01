const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/user_model");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ msg: "Registration successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

exports.addContact = async (req, res) => {
  const { name, email, mobile } = req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.contacts.push({ name, email, mobile });
    await user.save();

    res
      .status(200)
      .json({ msg: "Contact added successfully", contacts: user.contacts });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

exports.editContact = async (req, res) => {
  const { userId } = req.user;
  const { contactId } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const contact = user.contacts.id(contactId);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    Object.assign(contact, updates);
    await user.save();

    res
      .status(200)
      .json({ msg: "Contact updated successfully", contacts: user.contacts });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  const { userId } = req.user;
  const { contactId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const contact = user.contacts.id(contactId);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    user.contacts.pull(contactId);
    await user.save();

    res.status(200).json({ msg: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

exports.getContacts = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select("contacts");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ contacts: user.contacts });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};
