const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res)=>{
 const allisting =   await Listing.find({});
    res.render("listings/list.ejs",{allisting});
};

module.exports.renderNewListingForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.postingNewListing = async (req,res) =>{
 
  const location = req.body.listing.location;
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${location}.json?key=z1pjTNd0LLu4xw1RUC47`
  );

   const data = await response.json();

   if (!data.features.length) {
    throw new Error("Location not found");
  }

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,filename);
    // let {title,description,image,price,location,country} = req.body;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = {url , filename};
        newlisting.geometry = data.features[0].geometry;
       let savedlisting = await newlisting.save();

       console.log(savedlisting);
        req.flash("success" , "New listing created");
        res.redirect("/listings");
};

module.exports.showListingDetails = async (req,res) =>{
   let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
      path : "reviews",
      populate : {
        path : "author",
      },
   })
   .populate("owner");
   if(!listing){
     req.flash("error","Listing you requested, does not exists.");
     return res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs",{listing});
};

module.exports.editListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing you requested, does not exists.");
     return res.redirect("/listings");
   }

   let OriginalImageUrl = listing.image.url;
   OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,OriginalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
  let {id} = req.params;
  let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  console.log(req.file);
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url , filename};
  await listing.save();
 }

  req.flash("success" , "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) =>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success" , "listing deleted");
  res.redirect("/listings");
};