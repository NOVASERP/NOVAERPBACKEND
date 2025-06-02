const mongoose = require("mongoose");
mongoose.pluralize('null');



const uiSchema=new mongoose.Schema({
   logo:{type:String},
   themeCode:{type:String},
   loginImage:{type:String},
   schoolName:{type:String},
   
})

module.exports = mongoose.model("uiDesign", uiSchema);