import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const SubscriptionPlans = () => {
    const [plan, setPlan] = useState('monthly');
    const stripe = useStripe();
    const elements = useElements();

    const handlePlanChange = (e) => {
        setPlan(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
        } else {
            // Call your backend to create the subscription using paymentMethod.id
            console.log(paymentMethod);
        }
    };

    return (
        <div>
            <h2>Select Subscription Plan</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="monthly"
                            checked={plan === 'monthly'}
                            onChange={handlePlanChange}
                        />
                        $9.99 Monthly
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="yearly"
                            checked={plan === 'yearly'}
                            onChange={handlePlanChange}
                        />
                        $80 Yearly
                    </label>
                </div>
                <CardElement />
                <button type="submit" disabled={!stripe}>Submit</button>
            </form>
        </div>
    );
};

export default SubscriptionPlans;