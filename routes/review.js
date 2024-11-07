const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");



// REVIEW ROUTE

//post review route
router
    .post("/",validateReview,isLoggedIn,wrapAsync(ReviewController.postReview));
 
//delete review route
router
.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.deleteReview));

 module.exports = router;