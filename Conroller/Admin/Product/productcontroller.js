const Product = require("../../../Model/ProductModel")


exports.CreateProduct = async (req,res)=>{
    const {Product_name, Product_description, Product_price, Product_stockQTY, Product_status} = req.body

    if(!Product_name|| !Product_description || !Product_price || !Product_stockQTY || !Product_status){
        return res.status(400).json({
            message : "Please Enter Product_name, Product_description, Product_price, Product_stockQTY, Product_status"
        })
    }

   await Product.create({
        Product_Name : Product_name,
        Product_Description : Product_description,
        Product_Price : Product_price,
        Product_StockQTY : Product_stockQTY,
        Product_Status : Product_status
    })
    res.status(200).json({
        message : "Product Created Successfully"
    })
}

