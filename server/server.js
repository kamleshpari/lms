import express from  'express'
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';


//initialize express
//MONGO_URI = mongodb://127.0.0.1:27017

const app = express()

//connect to database
await connectDB()


//middlewares

app.use(cors())

//routes
app.get('/',(req,res)=>res.send("Api Working"))
app.post('/clerk',express.json(),clerkWebhooks)


//port 
const PORT =process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})