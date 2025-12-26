require('dotenv').config();
const cors=require('cors');
const express=require('express');
const path=require('path')
const multer=require('multer')
const cookie_parser=require('cookie-parser')
const mongoose=require('mongoose')
const Port=process.env.PORT||3000;
const {Server}=require('socket.io')
const app=express()
const origins=require('./config/origin')
const Connect=require('./config/connect')
Connect()

// app.use(cors(origins))
app.use(cors({ origin: (o, cb) => cb(null, true), credentials: true }));

app.use(cookie_parser())

app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname,"Public")))

app.use((req,res,next)=>{
    console.log(req.url , req.ip , req.method )
    next()
})

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
   cb(null,path.join(__dirname,"Public",path.extname(file.originalname).toLowerCase()===".epub"?"uploads":"img")) 
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+file.originalname)
  }
})

const uploads=multer({storage})
mongoose.connection.once('open',()=>{
    console.log('connect to MongoDB ')
   const ioserver= app.listen(Port,()=>{console.log('running on '+ Port)})

   const io=new Server(ioserver,{
    
        cors:{origin:'*',
      methods: ['GET', 'POST'],
        }
        
   })

   app.use((req,res,next)=>{
    req.io=io;
    next()
   })
  //  app.use('/',require('./Routes/root'))
   app.use('/Auth',uploads.single('file'),require('./Routes/Auth'))
   app.use('/otp/',require('./Routes/otp'))
   app.use('/api/startTrial',require('./Routes/StartTrial'))
   app.use('/GetUsers',require('./Routes/GetUsers'))
   app.use('/AllUsers',require('./Routes/AllUsers'))
   app.use('/GetAllPurchase',require('./Routes/GetAllPurchase'))
   app.use('/GetBooks',require('./Routes/Getbooks'))
   app.use('/AdminBooks',require('./Routes/AdminBooks'))
   app.use('/GetPurchased',require('./Routes/GetPurchased'))
   app.use('/GetTrials',require('./Routes/GetTrials'))
   app.use('/UpdateBookPage',require('./Routes/UpdatebookProgress'))
   app.use('/RemoveBookmark',require('./Routes/RemoveBookmark'))
   app.use('/UpdateProfile',uploads.single('file'),require('./Routes/UpdateProfile'))
   app.use('/UpdateBook',uploads.fields([
    {name:'file',maxCount:1},
    {name:'epub',maxCount:1}

   ]),require('./Routes/UpdateBook'))
   app.use('/Converter',uploads.single('file'),require('./Routes/Converter'))
   app.use('/Buy/Purchased',require('./Routes/Purchased'))
   app.use('/Buy/AddBooks',uploads.fields([
    {name:'file',maxCount:1},
    {name:'epub',maxCount:1}

   ]),require('./Routes/Addbooks'))
   app.use('/Add_categories', uploads.array('file'), require('./Routes/Add_categories'));
  app.use('/remove_categories', require('./Routes/remove_categories'));
  app.use('/GetCategories', require('./Routes/GetCategories'));
  app.use('/DeleteBook', require('./Routes/DeleteBook'));
  
})






