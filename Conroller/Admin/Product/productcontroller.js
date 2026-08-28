const Order = require("../../../Model/OrderSchema")
const Product = require("../../../Model/ProductModel")
const fs = require("fs")

//Create Product API
exports.CreateProduct = async (req,res)=>{
    try{
     const file = req.file
    let imagePath
if(!file){
    imagePath = "https://motobros.com/wp-content/uploads/2024/09/no-image.jpeg"
}else{
    imagePath =  `${process.env.HOST}/${file.filename}`;
}
    const {Product_name, Product_description, Product_price, Product_stockQTY, Product_status} = req.body

    if(!Product_name|| !Product_description || !Product_price || Product_stockQTY===undefined ||Product_stockQTY==="" || !Product_status){
        return res.status(400).json({
            message : "Please Enter Product_name, Product_description, Product_price, Product_stockQTY, Product_status"
        })
    }

   await Product.create({
        Product_Name : Product_name,
        Product_Description : Product_description,
        Product_Price : Product_price,
        Product_StockQTY : Product_stockQTY,
        Product_Status : Product_status,
        Product_Image : imagePath
    })
    res.status(200).json({
        message : "Product Created Successfully"
    })
}catch(err){
           res.status(500).json({
            message : "Something Went Wrong"
           })
    }
}

//Delete Product API
exports.deleteproduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please Provide Id"
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product Not Found"
    });
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({
    message: "Product Deleted Successfully"
  });
};

//Update Product
exports.editproduct = async(req,res)=>{
    const {id} = req.params
    const {Product_name, Product_description, Product_price, Product_stockQTY, Product_status} = req.body

     if(!Product_name|| !Product_description || !Product_price || Product_stockQTY === undefined || Product_stockQTY === "" || !Product_status ||!id){
        return res.status(400).json({
            message : "Please Enter ID, Product_name, Product_description, Product_price, Product_stockQTY, Product_status"
        })
    }
    const olddata = await Product.findById(id)
    if(!olddata){
        return res.status(400).json({
            message : "No Data Found"
        })
    }
    const oldproductImage = olddata.Product_Image    //localhost:2000/582028482_1219912666849727_3026635170846495448_n.jpg
    const lengthtocut = (process.env.HOST).length
    const finalImg = oldproductImage.slice(lengthtocut) //582028482_1219912666849727_3026635170846495448_n.jpg

if(req.file && req.file.filename){
    //Remove File from Uploads Folder
    fs.unlink("./uploads/" + finalImg,(err)=>{
        if(err){
            console.log("Error Deleting Failed",err)
        }else{
            console.log("File Deleted")
        }
    })
}
 const datas = await Product.findByIdAndUpdate(id,{
        Product_Name : Product_name,
        Product_Description : Product_description,
        Product_Price : Product_price,
        Product_StockQTY : Product_stockQTY,
        Product_Status : Product_status,
        Product_Image : req.file && req.file.filename ? process.env.HOST  + req.file.filename : oldproductImage
    },{
        returnDocument: "after"  //If we remove new: true, then datas will return the old product data, even though DB got updated.
    })
    res.status(200).json({
        message : "Product Updated  Successfully",
        data : datas
    })
}

//Update product status
exports.updateProductStatus = async(req,res)=>{
const {id} = req.params;
const {productStatus} = req.body

if(!productStatus || !["Available", "Unavailable"].includes(productStatus)){
    return res.status(400).json({
        message : "ProductStatus is Inavlid"
    })
}

const updatedProduct = await Product.findByIdAndUpdate(id, {
    Product_Status : productStatus
}, {
     returnDocument : "after",
     runValidators: true
})

if(!updatedProduct){
    return res.status(404).json({
        message : "No product Found"
    })
}

res.status(200).json({
    message : "Updated Successfully",
    data : updatedProduct
})
}

//Update stockQTY and price
exports.updateStockAndPrice = async (req, res) => {
  const { id } = req.params;
  const { ProductStockQTY, ProductPrice } = req.body;

  if (
    ProductStockQTY === undefined &&
    ProductPrice === undefined
  ) {
    return res.status(400).json({
      message: "Please provide stock quantity or price"
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "No product Found"
    });
  }

  const updateData = {};

  if (ProductStockQTY !== undefined) {
    updateData.Product_StockQTY = ProductStockQTY;
  }

  if (ProductPrice !== undefined) {
    updateData.Product_Price = ProductPrice;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    {
      returnDocument: "after",
      runValidators: true
    }
  );

  res.status(200).json({
    message: "Updated Successfully",
    data: updatedProduct
  });
};

