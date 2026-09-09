import { Spinner } from "../ui";

function Loading() {
	return (
		<div
			className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl
				flex flex-col items-center justify-center">
			<div
				className="bg-background/95 backdrop-blur-xl
					flex flex-col items-center justify-center
					w-full max-w-full sm:max-w-xs rounded-xl px-6 py-8">
				<Spinner className="text-foreground size-14" />
			</div>
		</div>
	);
}

export default Loading;
