import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database.js';
import { User } from '../entities/user.js';
import jwt from 'jsonwebtoken';

export class UserController {
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    try {
      await this.userRepository.save(newUser);
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token
      });
      console.log(token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  };
}
