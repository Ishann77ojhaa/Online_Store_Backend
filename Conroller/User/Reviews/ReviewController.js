const Product = require("../../../Model/ProductModel")
const Review = require("../../../Model/Reviewmodel")

// // Create Review
exports.createReview = async(req,res)=>{
    const userId = req.user.id
    const {rating,message} = req.body 
    const productId = req.params.id 
    // console.log(req.body,productId)
    if(!rating || !message || !productId) {
        return res.status(400).json({
            message : "Please provide rating,message,productId"
        })
    }
    
    // check if that productId product exists or not
    const productExist = await Product.findById(productId)
    if(!productExist){
        return res.status(404).json({
            message : 'Product with that productId doesnot exist'
        })
    }
    // insert them into Review 
    await Review.create({
        User_Id : userId,
        Product_Id : productId, 
        Rating : rating ,
        Message : message 
    })

    res.status(200).json({
        message : "Review added successfully"
    })
}

// //Delete the review 
exports.deleteReview = async(req,res)=>{
    const reviewId   = req.params.id 
    const userId = req.user.id
    if(!reviewId){
        res.status(400).json({
            message : "Please provide reviewId "
        })
    }

//check if that user created this review or not
   const review = Review.findById(reviewId)
   const ownerIdofReview = review.User_Id

   if(ownerIdofReview !== userId){
    return res.status(400).json({
        message : "You Don't have the permission to do this"
    })
   }

    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({
        message : "Review delete successfully"
    })

}

//Get All reviews For any specific User
exports.getmyreviews = async(req,res)=>{
    const userId = req.user.id
    const reviews = await Review.find({User_Id : userId})
    if(reviews.length ==0){
        res.status(400).json({
            message:"You Haven't given any Reviews",
            reviews : []
        })
    }else{
        res.status(200).json({
            message : "All Reviews Fetched Successfully",
            data : reviews
        })
    }
}



// exports.addProductReview = async(req,res)=>{
//     const productId = req.params.id 
//     const {rating,message} = req.body 
//     const userId = req.user.id 
//     const review = {
//         User_Id : userId , 
//         Rating : rating,
//         Message : message,

//     }
//     const product = await Product.findById(productId)
//     product.Reviews.push(Reviews) 
//     await product.save() 
//     res.json({
//         message : "Review done"
//     })
// }



