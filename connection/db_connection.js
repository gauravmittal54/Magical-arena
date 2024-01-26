const mongoose = require('mongoose');
const mongoUrl = 'mongodb://0.0.0.0/magicalArenaGame';

mongoose.connect(mongoUrl, {
}).then(() => {
    console.log("Connection is successful");
}).catch((e) => {
    console.log("No connection: ", e);
})