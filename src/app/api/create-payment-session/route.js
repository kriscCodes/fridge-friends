import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
	try {
		const { amount, itemName } = await request.json();

		// Create a Stripe checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: itemName,
						},
						unit_amount: amount,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
		});

		return NextResponse.json({ id: session.id });
	} catch (error) {
		console.error('Error creating payment session:', error);
		return NextResponse.json(
			{ error: 'Error creating payment session' },
			{ status: 500 }
		);
	}
}
