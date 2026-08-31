import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors'
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes.js'
import jobRouter from "./routes/job.routes.js";

import applicationRouter from "./routes/application.routes.js";
import profileRouter from "./routes/profile.routes.js";

dotenv.config()



const app= express()
connectDB()
const port= process.env.PORT || 3000

 app.use(express.json());
 app.use(express.urlencoded({extended:true}))


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
 app.use(cookieParser())

 

 app.use("/api/users", userRouter);
 app.use("/api/jobs", jobRouter);
 app.use("/api/applications", applicationRouter);
 app.use("/api/profile", profileRouter);



app.get('/',(req,res)=>{
    res.json({
        message: 'hi backend'
    })
})

app.listen(port,()=>{
    console.log(`server listen on this ${port}`)
})