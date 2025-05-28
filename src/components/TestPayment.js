'use client';

import StripePaymentButton from './StripePaymentButton';

const TestPayment = () => {
	const handleSuccess = () => {
		console.log('Payment successful!');
		// Add your success handling logic here
	};

	const handleError = (error) => {
		console.error('Payment failed:', error);
		// Add your error handling logic here
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Test Payment</h2>
			<StripePaymentButton
				amount={2000} // $20.00
				itemName="Test Item"
				onSuccess={handleSuccess}
				onError={handleError}
			/>
		</div>
	);
};

export default TestPayment;
