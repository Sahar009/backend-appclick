const http = require('http');
const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const userRoute = require('../Routes/userRoute')
const contactRoute = require('../Routes/contactRoute')
const videoRoute = require('../Routes/videoRoute')
const audioRoute = require('../Routes/audioRoute')
const errorHandler = require('../middleware/errorMiddleware')
const cookieParser = require('cookie-parser')
const ffmpeg = require('fluent-ffmpeg');
// const fileUpload = require('express-fileupload');



const path = require('path');
const serverPath = path.resolve(__dirname, 'server.js');
require(serverPath);

//Routes

app.get('/', (req,res) =>{
    res.send('Server running ');
    });


//middlewaress
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials:true
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const PORT =  8080

//Routes middleware
app.use('/api/users', userRoute)
app.use('/api/contactus', contactRoute)
app.use('/api/editvideo',videoRoute)
app.use('/api/addwatermark',videoRoute)
app.use('/api/audio',audioRoute)


// error handler
app.use(errorHandler)


//connect to mongoDB and start server


mongoose.connect('mongodb+srv://akinwumisehinde:XBkrM0wsnkLjUmix@cluster0.csj68ux.mongodb.net/appClick?retryWrites=true&w=majority')
.then(() =>{
    app.listen(PORT, () =>{
        console.log(`server running on port ${PORT}`)
    })
})
.catch((err) => console.log(err))


