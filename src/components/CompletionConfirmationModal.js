import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CompletionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  barterDetails,
  isUpdatingStatus,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Barter Completion</DialogTitle>
          <div className="text-sm text-gray-500">
            Click confirm to confirm that you have completed the barter. You will have to wait until the other user confirms also if they have not done so.
          </div>
        </DialogHeader>
        <div className="py-4">
          {/* Optionally display some barter details here */}
          {barterDetails && (
            <p className="text-sm text-gray-500">Item: {barterDetails.barter_posts?.name}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            style={{ borderRadius: 0, letterSpacing: '0.08em' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdatingStatus}
            className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: 0, letterSpacing: '0.08em' }}
          >
            {isUpdatingStatus ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 