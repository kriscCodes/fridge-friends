'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Request from '@/components/Request';
import Navbar from '@/components/Navbar';
import useRequests from '@/hooks/useRequests';
import RequestColumn from '@/components/RequestColumn';

export default function RequestsPage() {
	const { incomingRequests, outgoingRequests, loading, error, handleDeleteRequest, fetchRequests, handleRequestStatusChange } = useRequests();

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center text-red-600 font-mono">{error}</div>
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<main
				className="flex flex-col items-center min-h-screen p-6"
				style={{
					backgroundImage: "url('/images/BarterRequestsbg.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<h1 className="text-3xl font-bold mb-8 text-center uppercase text-white" style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}>
					Your Requests
				</h1>

				<div className="container mx-auto px-4 w-full max-w-6xl">
					{loading && (
						<p className="text-center text-white text-xl font-bold mb-4" style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}>
							Loading requests...
						</p>
					)}

					{!loading && !error && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Incoming Requests Column */}
							<RequestColumn
								title="Incoming Requests"
								requests={incomingRequests}
								isIncoming={true}
								onStatusChange={handleRequestStatusChange}
							/>

							{/* Outgoing Requests Column */}
							<RequestColumn
								title="Your Requests"
								requests={outgoingRequests}
								isIncoming={false}
								onDelete={handleDeleteRequest}
								emptyMessage="No pending outgoing requests"
							/>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
