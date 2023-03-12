import bcrypt from 'bcryptjs';
import User from './models/user.js';

import { connectDB } from './db.js';

await connectDB();

const userFound = await User.findOne({
  username: process.env.SUPER_USER,
});

if (!userFound) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(process.env.SUPER_USER_PASS, salt);

  try {
    const newUser = new User({
      username: process.env.SUPER_USER,
      email: process.env.SUPER_USER_MAIL,
      password: hashedPassword,
      role: 'admin',
    });
    await newUser.save();
    
  } catch (error) {
    
  }
} else {
  
}

process.exit();