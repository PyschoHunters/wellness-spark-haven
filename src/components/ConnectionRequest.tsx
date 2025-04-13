
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ConnectionRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientId: string;
  onSend: (recipientId: string, message: string, shareContact: boolean) => void;
}

const ConnectionRequest: React.FC<ConnectionRequestProps> = ({
  open,
  onOpenChange,
  recipientName,
  recipientId,
  onSend,
}) => {
  const [message, setMessage] = useState("");
  const [shareContact, setShareContact] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please add a message to introduce yourself.",
        variant: "destructive",
      });
      return;
    }

    onSend(recipientId, message, shareContact);
    setMessage("");
    setShareContact(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect with {recipientName}</DialogTitle>
          <DialogDescription>
            Send a message to introduce yourself and explain what you'd like to learn or share.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Hi! I'm interested in learning more about your expertise in..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareContact"
              checked={shareContact}
              onCheckedChange={(checked) => setShareContact(!!checked)}
            />
            <Label htmlFor="shareContact" className="text-sm">
              Share my contact information (email) with this person
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionRequest;
