import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
})

app.use(express.json({limit:"50mb"})); // To parse Json data in the request.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the request.body
app.use(cookieParser());


// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(5000, () => console.log(`server started ad localhost:${PORT}`)) 