require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../src/models/User");

// ==========================================
// ADMIN ACCOUNT DETAILS
// ==========================================

const ADMIN_NAME = "Store Admin";

const ADMIN_EMAIL =
  "admin@example.com";

const ADMIN_PASSWORD =
  "ChangeThisPassword123!";

// ==========================================
// CREATE ADMIN
// ==========================================

const createAdmin = async () => {
  try {
    // Check MongoDB connection string
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file."
      );
    }

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected."
    );

    // Normalize email
    const normalizedEmail =
      ADMIN_EMAIL
        .trim()
        .toLowerCase();

    // Check if user already exists
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      if (
        existingUser.role === "admin"
      ) {
        console.log(
          "Admin account already exists."
        );
      } else {
        console.log(
          "A user with this email already exists."
        );

        console.log(
          "Use a different admin email."
        );
      }

      return;
    }

    // Hash admin password
    const hashedPassword =
      await bcrypt.hash(
        ADMIN_PASSWORD,
        12
      );

    // Create admin user
    const admin =
      await User.create({
        name: ADMIN_NAME,
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

    console.log(
      "Admin account created successfully."
    );

    console.log(
      "Admin ID:",
      admin._id.toString()
    );

    console.log(
      "Admin Email:",
      admin.email
    );

    console.log(
      "Admin Role:",
      admin.role
    );
  } catch (error) {
    console.error(
      "Create admin error:",
      error.message
    );
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );
  }
};

// Run script
createAdmin();