# STRIPE_TESTING_GUIDE.md

## Comprehensive Guide for Setting Up and Testing Stripe in Test Mode

This guide will help you set up and test Stripe in Test Mode without needing SSN verification.

### Table of Contents
1. [Test Card Numbers](#test-card-numbers)
2. [Webhook Setup with Stripe CLI](#webhook-setup-with-stripe-cli)
3. [Test Scenarios](#test-scenarios)
4. [Moving from Test to Live Mode](#moving-from-test-to-live-mode)

### Test Card Numbers
To test Stripe payments, you can use the following test card numbers:

| Card Type              | Card Number     | Expiration Date | CVC  |
|-----------------------|-----------------|------------------|------|
| Visa                  | 4242 4242 4242 4242 | Any future date   | Any  |
| MasterCard            | 5555 5555 5555 4444 | Any future date   | Any  |
| American Express (AMEX) | 3782 8224 6310 005 | Any future date   | Any  |
| Discover              | 6011 1111 1111 1117 | Any future date   | Any  |

### Webhook Setup with Stripe CLI
1. **Install Stripe CLI**: You can install the Stripe CLI by following the instructions provided in the [official documentation](https://stripe.com/docs/stripe-cli#install).
2. **Login to Stripe Account**: Use the command `stripe login` to log in to your Stripe account.
3. **Start the CLI**: Run the command `stripe listen --forward-to localhost:3000/webhook` to listen for events and forward them to your local server.

### Test Scenarios
Here are some test scenarios you can use to verify your integration:
- Successful payment with a valid test card
- Payment with insufficient funds
- Payment with a declined card
- Handling of various webhook events (e.g., payment succeeded, payment failed)

### Moving from Test to Live Mode
1. **Update API Keys**: Replace your test secret key and publishable key with live keys from your Stripe Dashboard.
2. **Test in Production**: Conduct limited real transactions to ensure everything is working correctly.
3. **Monitor Transactions**: Use the Stripe Dashboard to monitor live transactions and ensure the flow works as expected.

By following this guide, you should be able to set up and test your Stripe integration smoothly without requiring SSN verification.