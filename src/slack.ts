const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? ''
const CHANNEL = '#order-alerts'

interface PendingOrder {
    order_id: number
    email: string
    phone: string
    days_since_order: number
    total_amount: number
}

function formatMessage(orders: PendingOrder[]): object {
    const lines = orders.map(
        (o) =>
            `• *${o.email}* | ${o.phone} | Order #${o.order_id} | ${o.days_since_order}d pending | $${o.total_amount}`,
    )
    return {
        channel: CHANNEL,
        text: `:warning: *${orders.length} order(s) have been pending for more than 3 days*`,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `:warning: *${orders.length} order(s) pending for more than 3 days — follow up needed*\n\n${lines.join('\n')}`,
                },
            },
        ],
    }
}

export async function sendOrderAlerts(orders: PendingOrder[]): Promise<void> {
    if (orders.length === 0) return

    const payload = formatMessage(orders)

    const isFake = !SLACK_WEBHOOK_URL || SLACK_WEBHOOK_URL === 'https://hooks.slack.com/services/FAKE'

    if (isFake) {
        console.log('[slack] webhook not configured — would have sent:')
        console.log(JSON.stringify(payload, null, 2))
        return
    }

    const res = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        throw new Error(`Slack webhook failed: ${res.status} ${res.statusText}`)
    }
}
