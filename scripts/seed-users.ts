import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { user } from '../lib/db/schema/auth-schema'
import { nanoid } from 'nanoid'
import type { Role } from '../lib/db/schema/auth-schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

const firstNames = [
    'Aditya',
    'Budi',
    'Citra',
    'Dewi',
    'Eko',
    'Fajar',
    'Gita',
    'Hendra',
    'Indah',
    'Joko',
    'Kartika',
    'Luthfi',
    'Maya',
    'Nanda',
    'Omar',
    'Putri',
    'Rizky',
    'Sari',
    'Taufik',
    'Ulfa',
    'Vina',
    'Wahyu',
    'Xena',
    'Yoga',
    'Zahra',
    'Arif',
    'Bella',
    'Cahyo',
    'Dina',
    'Evan',
    'Fira',
    'Galih',
    'Hani',
    'Ivan',
    'Jasmin',
    'Kevin',
    'Laras',
    'Miko',
    'Nita',
    'Odi',
    'Pandu',
    'Qila',
    'Rendra',
    'Sinta',
    'Teguh',
    'Umar',
    'Vera',
    'Widi',
    'Yani',
    'Zaki'
]

const lastNames = [
    'Pratama',
    'Santoso',
    'Wijaya',
    'Kusuma',
    'Hidayat',
    'Rahayu',
    'Putra',
    'Sari',
    'Nugroho',
    'Permata',
    'Saputra',
    'Dewi',
    'Wibowo',
    'Susanto',
    'Handoko',
    'Purnama',
    'Utama',
    'Firmansyah',
    'Hakim',
    'Setiawan'
]

const roles: Role[] = ['user', 'user', 'user', 'member', 'member', 'admin']

const avatarSeeds = Array.from({ length: 50 }, (_, i) => i + 1)

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

async function seed() {
    console.log('Seeding 50 dummy users...')

    const dummies = Array.from({ length: 50 }, (_, i) => {
        const first = firstNames[i] ?? pick(firstNames)
        const last = pick(lastNames)
        const name = `${first} ${last}`
        const slug = name.toLowerCase().replace(/\s+/g, '.')
        const email = `${slug}.${nanoid(4)}@example.com`
        const role = pick(roles)
        const seed = avatarSeeds[i]

        return {
            id: nanoid(),
            name,
            email,
            emailVerified: true,
            image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`,
            role,
            createdAt: new Date(
                Date.now() -
                    Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
            ),
            updatedAt: new Date()
        }
    })

    await db.insert(user).values(dummies)

    console.log(`✓ Inserted ${dummies.length} dummy users`)
    await client.end()
}

seed().catch((e) => {
    console.error(e)
    process.exit(1)
})
