import { ActionButton } from "./action-button";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  actionButton: { text: string; variant: "default" | "destructive" };
  isActionInProgress: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  content,
  actionButton,
  isActionInProgress,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onConfirm(false)}>
      <DialogContent>
        <DialogHeader className="pb-3">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter className="pt-4">
          <Button
            className="w-25"
            onClick={() => {
              onConfirm(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <ActionButton
            isLoading={isActionInProgress}
            type="button"
            className="w-25"
            variant={actionButton.variant}
            onClick={() => {
              onConfirm(true);
            }}
          >
            {actionButton.text}
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
