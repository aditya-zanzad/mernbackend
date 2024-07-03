const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect("mongodb://localhost:27017/youtuberegestration", {
   
   
}).then(() => {
    console.log("Connection successful");
}).catch((e) => {
    console.error("Connection failed:", e.message);
});
