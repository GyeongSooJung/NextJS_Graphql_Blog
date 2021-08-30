const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    // mongoose.connect('mongodb://'+process.env.MONGO_ID+':'+process.env.MONGO_PWD+'@'+process.env.MONGO_IP+':'+process.env.MONGO_PORT+'/admin', {
    mongoose.connect('mongodb://gsjung06:60609239@52.79.57.4:27270/admin', {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
        dbName: 'Blog'
    }, {
    }, (error) => {
        if (error) {
            console.log('DB Connection is Error', error);
        }
        else {
            console.log('DB Connect is SuccessFul!');
        }
    }).then(() => console.log("몽고연결"))
        .catch(err => console.log(err));
};
mongoose.connection.on('error', (error) => {
    console.error('DB Error', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('DB is disconnected, Continue to Connect DB');
    connect();
});

exports.connect = connect;