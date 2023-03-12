import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import timeStamp from '../utils/timestamp.js';
import User from '../models/user.js';
import tokenValidation from './tokenValidation.js';

const router = Router();

router
  .post('/login', async (req, res, next) => {
    const { body } = req;
    timeStamp('POST on /users/login');

    // TODO: Add validations
    if (!body.username || !body.password) {
      return res.status(400).json({
        error: true,
        message: 'El mensaje tiene campos vacios.',
      });
    }

    const user = await User.findOne({
      username: body.username,
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: 'El mensaje tiene informacion equivocada.',
      });
    }

    const passwordOk = await bcrypt.compare(body.password, user.password);

    if (user && passwordOk) {
      const token = jwt.sign(
        {
          username: user.username,
          role: user.role,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      const userToAddToken = await User.findOneAndUpdate(
        { username: body.username },
        {
          username: user.username,
          password: user.password,
          role: user.role,
          email: user.email,
          tokens: token,
        },
        {
          useFindAndModify: false,
        }
      );

      return res.header('auth-token', token).status(200).json({
        error: null,
        message: 'Credenciales ok',
        role: user.role,
        data: { token },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Credenciales erroneas.',
      });
    }
  })
  .post('/register', async (req, res, next) => {
    timeStamp('POST /users/register');
    const { body } = req;

    if (!body.username || !body.password || !body.email) {
      return res.status(400).json({
        error: true,
        message: 'El mensaje tiene campos vacios .',
      });
    }

    const newUserNameExist = await User.findOne({
      username: body.username,
    });
    const newUserMailExist = await User.findOne({
      email: body.email,
    });
    if (newUserNameExist || newUserMailExist) {
      return res.status(400).json({
        error: true,
        message: 'Usuario o email ya existentes.',
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    try {
      const newUser = new User({
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      
      res.status(400).json({ error: true, message: error });
    }
  })
  .put('/users', tokenValidation, async (req, res, next) => {
    const { body } = req;
    timeStamp('PUT/users/update' + body.username);

    const token = req.header('auth-token');
    const decodedToken = jwt.decode(token, { complete: true });

    const SUPER_USER = process.env.SUPER_USER || 'admin';

    if (body.username === SUPER_USER || !decodedToken.payload.role === 'admin') {
      return res.status(400).json({
        error: true,
        message: 'Acceso DENEGADO.',
      });
    }

    try {
      const modUser = await User.findOneAndUpdate(
        body.username,
        { username: body.username, password: body.password, role: body.role, email: body.email },
        {
          useFindAndModify: false,
        }
      );
      res.status(200).json(modUser);
    } catch (error) {
      
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })
  .delete('/users', tokenValidation, async (req, res, next) => {
    const { body } = req;
    const token = req.header('auth-token');
    const decodedToken = jwt.decode(token, { complete: true });
    timeStamp('DELETE/users/' + body.username);

    const SUPER_USER = process.env.SUPER_USER || 'admin';

    if (body.username === SUPER_USER || !decodedToken.payload.role === 'admin') {
      return res.status(400).json({
        error: true,
        message: 'Acceso DENEGADO.',
      });
    }

    try {
      const delUser = await User.findOneAndDelete({
        username: body.username,
      });
      res.status(200).json(delUser);
    } catch (error) {
      
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })
  .get('*', (req, res, next) => {
    timeStamp('GET on /users/*');
    res.status(404).json({ error: true, message: 'Not Found!' });
  })
  .post('*', (req, res, next) => {
    timeStamp('POST on /users/*');
    res.status(404).json({ error: true, message: 'Not Found!' });
  });

export default router;