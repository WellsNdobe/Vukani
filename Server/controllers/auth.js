import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Company from "../models/company.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register User or Company
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // check if email exists in either collection
    const existingUser = await User.findOne({ email }) || await Company.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (role === "company") {
      const newCompany = new Company({ name, email, password: hashedPassword });
      await newCompany.save();
      return res.status(201).json({ message: "Company registered successfully" });
    } else {
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User or Company
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let account = await User.findOne({ email });
    let accountType = "user";

    if (!account) {
      account = await Company.findOne({ email });
      accountType = "company";
    }

    if (!account) return res.status(404).json({ message: "Account not found" });

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: account._id, email: account.email, role: accountType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: account, token, role: accountType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
