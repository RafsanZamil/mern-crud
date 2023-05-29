const app = require("./app.js");
const config = require("./config/config");

const  PORT = config.app.port;

app.listen (PORT , ()=>{
    console.log('app is running on http://127.0.0.1:3000 ');
})