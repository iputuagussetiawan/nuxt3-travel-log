import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { subscriptionPlan } from '../lib/db/schema/subscription-schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

async function seed() {
    console.log('Seeding subscription plans...')

    await db
        .insert(subscriptionPlan)
        .values([
            {
                id: 'monthly',
                name: 'Monthly Member',
                price: 29000,
                interval: 'month',
                isActive: true
            },
            { id: 'yearly', name: 'Yearly Member', price: 290000, interval: 'year', isActive: true }
        ])
        .onConflictDoUpdate({
            target: subscriptionPlan.id,
            set: { name: subscriptionPlan.name, price: subscriptionPlan.price }
        })

    console.log('✓ Plans seeded: monthly (Rp 29.000) & yearly (Rp 290.000)')
    await client.end()
}

seed().catch((e) => {
    console.error(e)
    process.exit(1)
})
