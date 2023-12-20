const express = require("express");
const app = express();
const cors = require("cors");
const AppRouter = require("./routes/Routes");
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 4000;

app.use("/", AppRouter);

mongoose.connect(process.env.MONGODB)
.then(()=>{
  console.log("Mongodb Connected");
})
.catch((err)=>{
  console.error(err);
})
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});