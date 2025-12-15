import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Import routes
import reclaimRoutes from './routes/reclaim.routes.js';
import authRoutes from './routes/auth.routes.js';
import bindRoutes from './routes/bind.routes.js';
import healthRoutes from './routes/health.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Initialize Prisma Client with pg adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));

// Reclaim callback special handling: parse as text to avoid 'qs' mangling JSON bodies sent as urlencoded
app.use('/api/reclaim/callback', express.text({ type: '*/*' }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach prisma to request for route handlers
app.use((req, _res, next) => {
    req.prisma = prisma;
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check and utility routes
app.use('/', healthRoutes);
app.use('/api', healthRoutes);

// Reclaim Protocol routes
app.use('/api/reclaim', reclaimRoutes);
app.use('/api', reclaimRoutes); // For /api/verify-kyc/:userId

// Authentication routes
app.use('/api/auth', authRoutes);

// Identity binding route
app.use('/api/bind', bindRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Reclaim init: http://localhost:${PORT}/api/reclaim/init?userId=<USER_ID>`);
    console.log(`\n✅ Reclaim Protocol configured with:`);
    console.log(`   - App ID: ${process.env.RECLAIM_APP_ID}`);
    console.log(`   - Provider ID: ${process.env.RECLAIM_PROVIDER_ID}`);
    console.log(`\n🔑 Binance API configured\n`);
});

export default app;