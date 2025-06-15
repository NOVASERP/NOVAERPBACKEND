const mongoose = require("mongoose");
mongoose.pluralize('null');



const uiSchema=new mongoose.Schema({
   logo:{type:String},
   loginImage:{type:String},
   schoolName:{type:String},
   // schoolDomain:{type:String},
   favIcon:{type:String},
   buttonColor:{type:String},
   address:{type:String},
   websiteUrl:{type:String},
   email:{type:String},
   contactNo:{type:String},
   hoverColor:{type:String},
   sliderColor:{type:String},
   cardColor:{type:String},
   navbarColor:{type:String}
})

module.exports = mongoose.model("uiDesign", uiSchema);