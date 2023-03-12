import jwt from 'jsonwebtoken';



const tokenValidation = (req, res, next) => {

  const token = req.header('auth-token');


  if (!token) return res.status(401).json({ error: true, message: 'Acceso DENEGADO' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
      es.status(400).json({ error: true, message: 'Acceso DENEGADO 2' });
  }

};



export default tokenValidation;
