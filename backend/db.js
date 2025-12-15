import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const { Pool } = pg

const connectionString = "postgresql://postgres:root@localhost:5432/deeproof_db"

console.log("🔌 FORCE CONNECT TO:", connectionString);

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma