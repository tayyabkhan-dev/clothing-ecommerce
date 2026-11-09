
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../src/models/User");

const createAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing.");
    }

    if (!adminName || !adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env."
      );
    }

    if (adminPassword.length < 12) {
      throw new Error(
        "Admin password must be at least 12 characters long."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    const normalizedEmail = adminEmail.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      console.log(
        existingUser.role === "admin"
          ? "Admin account already exists."
          : "A user with this email already exists. Use another email."
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      name: adminName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log("Admin ID:", admin._id.toString());
    console.log("Admin Email:", admin.email);
    console.log("Admin Role:", admin.role);
  } catch (error) {
    console.error("Create admin error:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
  }
};

createAdmin();
