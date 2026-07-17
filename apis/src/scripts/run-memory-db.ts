import { MongoMemoryServer } from 'mongodb-memory-server';

const startMemoryDb = async () => {
  try {
    console.log('Starting MongoDB Memory Server on port 27017...');
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'playwright-taas',
        ip: '127.0.0.1'
      }
    });

    const uri = mongoServer.getUri();
    console.log(`MongoDB Memory Server started and listening at: ${uri}`);
    console.log('Database instance is now ready.');

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('\nShutting down database server...');
      await mongoServer.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    process.exit(1);
  }
};

startMemoryDb();
