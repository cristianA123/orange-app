export default () => ({
  // Configuración de la base de datos
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'testuser',
    password: process.env.DB_PASSWORD || 'testuser123',
    database: process.env.DB_DATABASE || 'nestjs_db',
  },

  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
  },

  // Configuración de CORS
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
  },
  nats: {
    host: process.env.NATS_HOST || 'localhost',
    port: parseInt(process.env.NATS_PORT, 10) || 4222,
    clusterId: process.env.NATS_CLUSTER_ID || 'test-cluster',
    clientId: process.env.NATS_CLIENT_ID || 'test-client',
  },
  s3: {
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
