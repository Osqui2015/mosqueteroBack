import express from "express"
import postsRoutes from './routes/posts.routes.js';
import authRoutes from './routes/auth.routes.js';
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cors());

app.use(postsRoutes);
app.use(authRoutes);

export default  app ;

