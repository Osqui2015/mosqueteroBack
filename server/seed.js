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
    console.log('SUPER USER CREATED! ' + newUser.username);
  } catch (error) {
    console.log('Error trying to create a new SUPER USER', error);
  }
} else {
  console.log('SUPER USER already exists');
}

process.exit();