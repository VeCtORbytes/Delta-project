const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner : '67297ea608743b78db299611'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");

};

   initDb();



