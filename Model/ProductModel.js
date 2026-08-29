const mongoose = require("mongoose")
const { reviewSchema } = require("./NextReviewModel")
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
    Product_Category:{
        type : String,
        required : [true,"Category is must"]
    },
    Product_Price:{
        type : Number,
        required : [true,"Price is must"]
    },
    Product_StockQTY:{
        type : Number,
        required : [true,"QTY is must"],
        min: [0, "Stock quantity can't be negative"]
    },
    Product_Status:{
        type: String,
        enum : ["Available","Unavailable"],
        default : "Available"
    },
    Product_Image:{
        type : String
},
},
{
    timestamps : true
})

const Product = mongoose.model("Product",Productschema)
module.exports = Product

