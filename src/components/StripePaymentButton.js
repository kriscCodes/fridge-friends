'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const StripePaymentButton = ({ amount, itemName, onSuccess, onError }) => {
	const [loading, setLoading] = useState(false);

	const handlePayment = async () => {
		try {
			setLoading(true);

			// Create a payment session
			const response = await fetch('/api/create-payment-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount,
					itemName,
				}),
			});

			const session = await response.json();

			// Redirect to Stripe Checkout
			const stripe = await stripePromise;
			const { error } = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			if (error) {
				onError?.(error.message);
			} else {
				onSuccess?.();
			}
		} catch (err) {
			onError?.(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handlePayment}
			disabled={loading}
			className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? 'Processing...' : `Buy for $${(amount / 100).toFixed(2)}`}
		</button>
	);
};

export default StripePaymentButton;
