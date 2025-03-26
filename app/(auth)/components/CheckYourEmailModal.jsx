import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function CheckYourEmailModal({ isOpen, onClose, email }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            We sent a confirmation link to:
            <p className="font-medium text-primary mt-2">{email}</p>
            <p className="mt-4">
              Please check your email and click the link to activate your
              account.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
