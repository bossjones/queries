import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

import { createSchema } from './schema'
import { findDeliveryDelays } from './queries/shipping_queries'
import { sendOrderAlerts } from './slack'

async function main() {
    const db = await open({
        filename: 'ecommerce.db',
        driver: sqlite3.Database,
    })

    await createSchema(db, false)

    const delayed = await findDeliveryDelays(db, 3)
    const pendingTooLong = delayed.filter((o) => o.current_status === 'pending')
    await sendOrderAlerts(pendingTooLong)
}

main()
