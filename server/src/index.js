const express=require('express')
const cors=require('cors') 
const cookieParser = require('cookie-parser')
const app=express()
const router = require('./routes/routes.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use('/api',router)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})