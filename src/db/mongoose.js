const
    mongoose = require('mongoose'),
    SERVER = process.env.DB_SERVER_URL;

mongoose.connect(SERVER, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
