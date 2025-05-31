const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
require("./config/dbConnection");

const Routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const sms=require("./common/twillioSms")
// var corsOptions = {
//   origin: "*",
// };
// app.use(cors(corsOptions));
// middlware for cache bust
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});

// ✅ Register routes BEFORE starting the server
Routes(app);
// sms.sendSMS('+918115199076',"Hello Mohit i am trying to implement twilio!")
app.listen(PORT, () => {
  console.log(`Secure app is listening @port ${PORT}`);
});
