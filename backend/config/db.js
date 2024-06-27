const mongoose=require("mongoose");
const dotenv=require("dotenv");
const colors=require("colors");


const connectDB=async()=>{
    
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI,{
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);

    }catch (error){
        console.log(`Error: ${error.message}`);
        process.exit();
         
    }
} 



//  pakistan batting again led them to loose game against india in newyork it was a heart blazzing game and eventually india won despite of scorring run a ball  batting first .From india batting point of view it was a bizarre performance .Whole credit goes to indian bowlers  espically bum bum bumrah he is a legend of all format . He has made it posibble here also.
// When he came to bowl the win predictor was 80 : 10 in favour of pakistan but He turnedaround from there takin three crutial wickets of babar,rizwan, and chaahu(Iftikar). But this win cannot hide the batting performance of india it need to improve going ahead  in this tournament 
module.exports=connectDB;   



