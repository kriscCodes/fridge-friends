'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BarterCard from '@/components/BarterCard';
import ChatSection from '@/components/ChatSection';
import CompletionConfirmationModal from '@/components/CompletionConfirmationModal';
import useBarters from '@/hooks/useBarters';

export default function OngoingBartersPage() {
	const [selectedBarter, setSelectedBarter] = useState(null);
	const {
		barters,
		loading,
		error,
		currentUser,
		handleMarkCompleteClick,
		isCompletionModalOpen,
		selectedBarterForCompletion,
		handleConfirmCompletion,
		handleCancelCompletion,
		isUpdatingCompletionStatus,
	} = useBarters('accepted');

	if (loading) {
		return (
			<div
				className="min-h-screen w-full flex items-center justify-center"
				style={{
					backgroundImage: "url('/images/ONGOINGFARTERS.PNG')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<p
					className="text-white text-2xl font-bold"
					style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
				>
					Loading barters...
				</p>
			</div>
		);
	}

	if (error) return <div className="text-red-500 p-8 font-mono">{error}</div>;

	return (
		<>
			<Navbar />
			<main
				className="flex min-h-screen p-6"
				style={{
					backgroundImage: "url('/images/ONGOINGFARTERS.PNG')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<div className="w-full max-w-4xl mx-auto">
					<h1
						className="text-2xl font-bold mb-6 text-white"
						style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
					>
						Ongoing Barters
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Barter List */}
						<div className="space-y-4">
							{barters.length === 0 ? (
								<p
									className="text-white text-xl font-bold"
									style={{
										fontFamily: 'monospace',
										textShadow: '2px 2px 0px #000',
									}}
								>
									No ongoing barters
								</p>
							) : (
								barters.map((barter) => (
									<BarterCard
										key={barter.id}
										barter={barter}
										currentUser={currentUser}
										onMarkComplete={() => handleMarkCompleteClick(barter)}
										isSelected={selectedBarter?.id === barter.id}
										onClick={() => setSelectedBarter(barter)}
									/>
								))
							)}
						</div>

						{/* Chat Section */}
						<ChatSection
							barterId={selectedBarter?.id}
							currentUser={currentUser}
						/>
					</div>
				</div>
			</main>

			{/* Completion Confirmation Modal */}
			<CompletionConfirmationModal
				isOpen={isCompletionModalOpen}
				onClose={handleCancelCompletion}
				onConfirm={handleConfirmCompletion}
				barterDetails={selectedBarterForCompletion}
				isUpdatingStatus={isUpdatingCompletionStatus}
			/>
		</>
	);
}
