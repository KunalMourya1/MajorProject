const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin,isOwnedBY,validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


const listingController = require("../controllers/listing.js");

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingController.postingNewListing));

//create new listings
router.get("/new",isLoggedin,listingController.renderNewListingForm );

router
.route("/:id")
.get(wrapAsync(listingController.showListingDetails))
.put(isLoggedin,isOwnedBY,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwnedBY, wrapAsync(listingController.destroyListing));


//edit
router.get("/:id/edit",isLoggedin,isOwnedBY ,wrapAsync(listingController.editListing));


module.exports = router;