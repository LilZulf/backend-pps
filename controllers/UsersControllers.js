import Users from '../models/UsersModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config()


const { JWT_SECRET, JWT_EXPIRE } = process.env;

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const registerUser = async (req, res) => {
  const { nama, email, password, verified, jabatan, terakhir_masuk } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await Users.create({
      nama,
      email,
      password: hashedPassword,
      verified,
      jabatan,
      terakhir_masuk,
    });

    // Generate and return JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' + JWT_SECRET });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ where: { email } });

    // If user is not found, return error
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and return JWT token
    const token = user.generateAuthToken();
    // Update user's terakhir_masuk
    await Users.update({ terakhir_masuk: new Date() }, { where: { id: user.id } });

    res.json({
      id: user.id,
      nama: user.nama,
      token
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};