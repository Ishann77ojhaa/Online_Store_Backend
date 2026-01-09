const mongoose = require("mongoose")
// const schema = mongoose.schema
const Productschema = new mongoose.Schema({

    Product_Name:{
        type : String,
        required : [true,"Name is Must"]
    },
    Product_Description:{
        type : String,
        required : [true,"Des is must"]
    },
    Product_Price:{
        type : Number,
        required : [true,"Price is must"]
    },
    Product_StockQTY:{
        type : Number,
        required : [true,"QTY is must"]
    },
    Product_Status:{
        type: String,
        enum : ["Available","Unavailable"],
        default : "Available"
    }
},
{
    timestamps : true
})

const Product = mongoose.model("Product",Productschema)
module.exports = Product

