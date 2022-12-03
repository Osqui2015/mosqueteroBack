import express from "express"
import postsRoutes from './routes/posts.routes.js';
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false }));


app.use(postsRoutes);

export default  app ;

