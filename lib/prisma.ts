import ws from 'ws'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

const PrismaClientSingleton = () => {
    neonConfig.webSocketConstructor = ws
    const connectionString = `${process.env.DIRECT_URL!}`

    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)
    const prisma = new PrismaClient({ adapter })
    return prisma
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof PrismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}