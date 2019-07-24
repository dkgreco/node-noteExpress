//Build the CRUD Operations
const
    mongodb = require('mongodb'),
    { MongoClient, ObjectID } = mongodb,
    id = new ObjectID(),
    connectionURL = 'mongodb://127.0.0.1:27017',
    databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) { return console.log('Unable to Connect to the Database') }
    console.log('Database Connection Successful!');

    const db = client.db(databaseName);

    db.collection('users').deleteOne({
        _id: new ObjectID('5d300426a089020b1e3b8727')
    }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    });

});

