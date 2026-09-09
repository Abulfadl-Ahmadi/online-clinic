"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

interface CancelDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	cancelReason: string;
	setCancelReason: (v: string) => void;
	onConfirm: () => void;
	cancelling: boolean;
}

export default function CancelDialog({
	open,
	onOpenChange,
	cancelReason,
	setCancelReason,
	onConfirm,
	cancelling,
}: CancelDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>لغو نوبت</DialogTitle>
					<DialogDescription>
						آیا از لغو این نوبت اطمینان دارید؟
					</DialogDescription>
				</DialogHeader>

				<Textarea
					placeholder="دلیل لغو (اختیاری)..."
					value={cancelReason}
					onChange={(e) => setCancelReason(e.target.value)}
					rows={3}
				/>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={cancelling}>
						انصراف
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={cancelling}>
						{cancelling && <Spinner className="size-4 me-2" />}
						{cancelling ? "در حال لغو..." : "لغو نوبت"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
