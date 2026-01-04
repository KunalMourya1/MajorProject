const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("../models/user.js");


const Mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(Mongo_url);
}

const intdb = async () =>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner : "6952f77fe7c9c97ca48da800",
  }));
  await Listing.insertMany(initData.data); //to access key data .data must be used.
  console.log("data initialize");
};

intdb();