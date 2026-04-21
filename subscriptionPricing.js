// subscriptionPricing.js

const subscriptions = {
    monthly: {
        price: 9.99,
        currency: 'usd',
        interval: 'month',
        description: 'Monthly subscription at $9.99'
    },
    yearly: {
        price: 80,
        currency: 'usd',
        interval: 'year',
        description: 'Yearly subscription at $80'
    }
};

module.exports = subscriptions;

// Sample implementation with Stripe
const stripe = require('stripe')('your-stripe-secret-key');

const createSubscription = async (customerId, plan) => {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.description,
                        },
                        unit_amount: plan.price * 100,
                        recurring: {
                            interval: plan.interval,
                        },
                    },
                }
            ],
        });
        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};

// To use the createSubscription function:
// const subscription = await createSubscription('customer_id_here', subscriptions.monthly);