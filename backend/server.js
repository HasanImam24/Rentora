import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import { config } from './src/config/environment.js';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

connectDatabase();

const server = app.listen(config.port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
