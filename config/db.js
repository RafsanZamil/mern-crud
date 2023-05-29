const mongoose = require("mongoose");

const config = require("./config");

const dbURL =   config.db.url;


mongoose
.connect(dbURL)
.then(()=>{
    console.log('mongodb atlas is connected');
})
.catch(()=>{
    console.log(error);
    process.exit(1);
});