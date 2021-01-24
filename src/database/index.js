const mongoose = require('mongoose');

mongoose.connect(process.env.DB_MONGO, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

module.exports = mongoose;