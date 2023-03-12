import jwt from 'jsonwebtoken';



const adminTokenVal = (req, res, next) => {

  const token = req.header('auth-token');


  if (!token) return res.status(401).json({ error: true, message: 'Acceso DENEGADO' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    const decodedToken = jwt.decode(token, { complete: true });

    if (decodedToken.role !== 'admin'){
      res.status(400).json({ error: true, message: 'Acceso No Admin' });
    }

    next();
  } catch (error) {
    res.status(400).json({ error: true, message: 'Acceso DENEGADO 2' });
  }
};



export default adminTokenVal;