const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');

const app = express();
const stripe = Stripe('YOUR_STRIPE_SECRET_KEY');

app.use(bodyParser.json());

// Create a Checkout Session for Subscription
app.post('/create-checkout-session', async (req, res) => {
    const { plan } = req.body;
    let priceId;

    // Price IDs for monthly and yearly subscriptions
    if (plan === 'monthly') {
        priceId = 'price_monthly_id';  // Replace with your actual monthly price ID
    } else if (plan === 'yearly') {
        priceId = 'price_yearly_id';   // Replace with your actual yearly price ID
    } else {
        return res.status(400).send({ error: 'Invalid plan type' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Webhook to handle subscription events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const event = req.body;

    switch (event.type) {
        case 'customer.subscription.created':
            const subscriptionCreated = event.data.object;
            console.log('Subscription created:', subscriptionCreated);
            break;
        case 'customer.subscription.deleted':
            const subscriptionDeleted = event.data.object;
            console.log('Subscription canceled:', subscriptionDeleted);
            break;
        default:
            console.log('Unhandled event type:', event.type);
    }

    res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
