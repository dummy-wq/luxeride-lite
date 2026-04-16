import { MongoClient } from 'mongodb';

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'luxeride';

    if (!uri) {
        console.error('❌ MONGODB_URI is not defined in environment');
        process.exit(1);
    }

    // Hide credentials in log
    const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
    console.log(`🔍 Attempting to connect to: ${maskedUri}`);

    const client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
    });

    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log(`📂 Collections in "${dbName}":`, collections.map(c => c.name));

        await client.close();
        console.log('👋 Connection closed.');
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
