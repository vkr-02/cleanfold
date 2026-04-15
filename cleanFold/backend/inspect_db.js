const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(async err => {
    if (err) {
        console.error('Failed to connect:', err);
        process.exit(1);
    }
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(db => db.name));

    for (const dbName of ['smartDhopa', 'Laundry']) {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log(`\nDB: ${dbName}`);
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} docs`);
            if (count > 0) {
                const sample = await db.collection(col.name).findOne();
                console.log(`   Sample keys: ${Object.keys(sample).join(', ')}`);
            }
        }
    }
    client.close();
});
