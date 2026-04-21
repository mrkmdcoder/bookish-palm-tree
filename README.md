# StatVault: CinderLog Website

This repository contains the StatVault CinderLog interface with a dark-fantasy visual system, animated 3D ember effects, and subscription-gated product sections.

## Main UI Component

- `SubscriptionPlans.jsx` now provides the complete animated CinderLog website experience with:
  - Top tab navigation (Dashboard, Leaderboard, Personal Stats, Shop, Character Customization, Quests, Account/Settings)
  - Three.js background scene (floating/rotating objects + ember particle field)
  - Framer Motion transitions, hover effects, loading animations, and parallax glow layers
  - Subscription gate states (logged out, no subscription paywall, expired renewal prompt, active access)
  - Reusable section cards for leaderboard, quest tracking, shop, stats, and character preview

## Stripe Pricing Environment Variables

Use `.env.example` and set:

- `REACT_APP_STRIPE_MONTHLY_PRICE_ID`
- `REACT_APP_STRIPE_YEARLY_PRICE_ID`

Pricing remains:
- Monthly: **$9.99/month**
- Yearly: **$80/year**
