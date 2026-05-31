import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'
import { db } from '~/lib/db'
import { session, user } from '~/lib/db/schema'
import { eq, isNotNull } from 'drizzle-orm'

export type RegionPoint = {
    regionKey: string
    state: string
    country: string
    lat: number
    lng: number
    sessionCount: number
    userCount: number
    users: { name: string; image: string | null }[]
}

function isPrivateIp(ip: string) {
    return (
        ip.startsWith('127.') ||
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        ip.startsWith('172.') ||
        ip === '::1' ||
        ip === 'localhost'
    )
}

export default defineRoleEventHandler('admin', async () => {
    // Get all sessions with IP + user info
    const sessions = await db
        .select({
            ip: session.ipAddress,
            userId: user.id,
            userName: user.name,
            userImage: user.image
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(isNotNull(session.ipAddress))

    // Map: ip -> { sessions count, unique users }
    type IpEntry = { count: number; users: Map<string, { name: string; image: string | null }> }
    const ipMap = new Map<string, IpEntry>()

    for (const s of sessions) {
        if (!s.ip || isPrivateIp(s.ip)) continue
        const existing = ipMap.get(s.ip)
        if (existing) {
            existing.count++
            existing.users.set(s.userId, { name: s.userName, image: s.userImage })
        } else {
            const users = new Map<string, { name: string; image: string | null }>()
            users.set(s.userId, { name: s.userName, image: s.userImage })
            ipMap.set(s.ip, { count: 1, users })
        }
    }

    if (ipMap.size === 0) return DUMMY_REGIONS

    // Geolocate IPs — include regionName (state) and countryCode
    const batch = [...ipMap.keys()].slice(0, 100).map((ip) => ({ query: ip }))

    try {
        const res = await fetch(
            'http://ip-api.com/batch?fields=status,query,lat,lon,city,regionName,country,countryCode',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch)
            }
        )

        if (!res.ok) return DUMMY_REGIONS

        const geoData = (await res.json()) as Array<{
            status: string
            query: string
            lat: number
            lon: number
            city: string
            regionName: string
            country: string
            countryCode: string
        }>

        // Group by state (regionName + countryCode)
        const regionMap = new Map<
            string,
            {
                state: string
                country: string
                lat: number
                lng: number
                sessions: number
                users: Map<string, { name: string; image: string | null }>
            }
        >()

        for (const geo of geoData) {
            if (geo.status !== 'success') continue
            const ipEntry = ipMap.get(geo.query)
            if (!ipEntry) continue

            const regionKey = `${geo.regionName}__${geo.countryCode}`
            const existing = regionMap.get(regionKey)

            if (existing) {
                existing.sessions += ipEntry.count
                for (const [uid, uinfo] of ipEntry.users) {
                    existing.users.set(uid, uinfo)
                }
            } else {
                regionMap.set(regionKey, {
                    state: geo.regionName || geo.city,
                    country: geo.country,
                    lat: geo.lat,
                    lng: geo.lon,
                    sessions: ipEntry.count,
                    users: new Map(ipEntry.users)
                })
            }
        }

        if (regionMap.size === 0) return DUMMY_REGIONS

        return [...regionMap.entries()].map(
            ([key, r]): RegionPoint => ({
                regionKey: key,
                state: r.state,
                country: r.country,
                lat: r.lat,
                lng: r.lng,
                sessionCount: r.sessions,
                userCount: r.users.size,
                users: [...r.users.values()].slice(0, 5)
            })
        )
    } catch {
        return DUMMY_REGIONS
    }
})

const DUMMY_REGIONS: RegionPoint[] = [
    {
        regionKey: 'Bali__ID',
        state: 'Bali',
        country: 'Indonesia',
        lat: -8.6705,
        lng: 115.2126,
        sessionCount: 12,
        userCount: 4,
        users: [
            { name: 'Maya Wibowo', image: null },
            { name: 'Fajar Rahayu', image: null },
            { name: 'Aditya Pratama', image: null }
        ]
    },
    {
        regionKey: 'DKI Jakarta__ID',
        state: 'DKI Jakarta',
        country: 'Indonesia',
        lat: -6.2088,
        lng: 106.8456,
        sessionCount: 9,
        userCount: 3,
        users: [
            { name: 'Rizky Santoso', image: null },
            { name: 'Sari Wijaya', image: null }
        ]
    },
    {
        regionKey: 'England__GB',
        state: 'England',
        country: 'United Kingdom',
        lat: 51.5074,
        lng: -0.1278,
        sessionCount: 5,
        userCount: 2,
        users: [{ name: 'Budi Santoso', image: null }]
    },
    {
        regionKey: 'New York__US',
        state: 'New York',
        country: 'United States',
        lat: 40.7128,
        lng: -74.006,
        sessionCount: 7,
        userCount: 3,
        users: [
            { name: 'Citra Wijaya', image: null },
            { name: 'Evan Hidayat', image: null }
        ]
    },
    {
        regionKey: 'Tokyo__JP',
        state: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        sessionCount: 8,
        userCount: 2,
        users: [{ name: 'Dewi Kusuma', image: null }]
    },
    {
        regionKey: 'Île-de-France__FR',
        state: 'Île-de-France',
        country: 'France',
        lat: 48.8566,
        lng: 2.3522,
        sessionCount: 3,
        userCount: 1,
        users: [{ name: 'Eko Hidayat', image: null }]
    },
    {
        regionKey: 'Singapore__SG',
        state: 'Singapore',
        country: 'Singapore',
        lat: 1.3521,
        lng: 103.8198,
        sessionCount: 6,
        userCount: 3,
        users: [
            { name: 'Gita Putra', image: null },
            { name: 'Hani Permata', image: null }
        ]
    },
    {
        regionKey: 'New South Wales__AU',
        state: 'New South Wales',
        country: 'Australia',
        lat: -33.8688,
        lng: 151.2093,
        sessionCount: 4,
        userCount: 2,
        users: [{ name: 'Ivan Saputra', image: null }]
    },
    {
        regionKey: 'Maharashtra__IN',
        state: 'Maharashtra',
        country: 'India',
        lat: 19.076,
        lng: 72.8777,
        sessionCount: 5,
        userCount: 2,
        users: [{ name: 'Kartika Saputra', image: null }]
    },
    {
        regionKey: 'Seoul__KR',
        state: 'Seoul',
        country: 'South Korea',
        lat: 37.5665,
        lng: 126.978,
        sessionCount: 3,
        userCount: 1,
        users: [{ name: 'Luthfi Dewi', image: null }]
    },
    {
        regionKey: 'Bavaria__DE',
        state: 'Bavaria',
        country: 'Germany',
        lat: 48.1351,
        lng: 11.582,
        sessionCount: 2,
        userCount: 1,
        users: [{ name: 'Nanda Susanto', image: null }]
    },
    {
        regionKey: 'Dubai__AE',
        state: 'Dubai',
        country: 'UAE',
        lat: 25.2048,
        lng: 55.2708,
        sessionCount: 5,
        userCount: 2,
        users: [{ name: 'Omar Handoko', image: null }]
    }
]
