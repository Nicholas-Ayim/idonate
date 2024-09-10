// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
require("dotenv").config()
const db = require("./database/db")
db()
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//proceed with cors config
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
}))


app.use(bodyParser.json());


//router middleware
const faceRouter = require("./routers/faceRoute")
app.use("/donor",faceRouter)


//################################
const HospitalRouter = require("./routers/hospitalRouter/hospitalRouter")
app.use("/hospital",HospitalRouter)



// #################################

//register donor, login donor routes
const DonorRouter = require("./routers/donorRouter/donorRouter")
app.use("/donor/register",DonorRouter)


//#################################
//router for all pagination.
const DonorPaginationRouter = require("./routers/paginateRouter/paginateRouter")
app.use("/paginate",DonorPaginationRouter)

//#################################
//router for searching donors
const SearchRouter = require("./routers/searchRouter/searchRouters")
app.use("/search",SearchRouter)


app.listen(process.env.PORT ,() => {
  console.log(`Server running on port ${process.env.PORT}`)
});
 
