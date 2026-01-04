const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedin,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


//review posting route
router.post("/",isLoggedin,validateReview, wrapAsync(reviewController.postingNewReview));

//review deleting route 
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyingReview));

module.exports = router;
