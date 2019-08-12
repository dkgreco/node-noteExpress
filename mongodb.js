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
});

