const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

router
  .route("/")
    .get( wrapAsync(ListingController.index))
    .post(
       isLoggedIn,
       upload.single('listing[image]'),
       validateListing,
       wrapAsync(ListingController.createListing));

// New Route
router
.get("/new",isLoggedIn, wrapAsync(ListingController.new));    

router
  .route("/:id")
    .get( wrapAsync(ListingController.show))
    .put(isLoggedIn,
      isOwner,
      upload.single('listing[image]'),
      validateListing,

       wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn,isOwner,
           wrapAsync(ListingController.deleteListing));
           
           // Edit Route
  router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.renderEditForm));
  
  module.exports = router;