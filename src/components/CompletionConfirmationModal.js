import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
          <DialogDescription>
            Click confirm to confirm that you have completed the barter. You will have to wait until the other user confirms also if they have not done so.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Optionally display some barter details here */}
          {barterDetails && (
            <p className="text-sm text-gray-500">Item: {barterDetails.barter_posts?.name}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdatingStatus}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isUpdatingStatus}>
            {isUpdatingStatus ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 