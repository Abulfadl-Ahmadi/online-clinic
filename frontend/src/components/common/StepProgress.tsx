"use client";

interface StepProgressProps {
	step: number;
	totalSteps: number;
}

const StepProgress = ({ step, totalSteps }: StepProgressProps) => {
	return (
		<div className="flex justify-center gap-2">
			{Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
				<div
					key={i}
					className={`h-2 rounded-full transition-all ${
						i === step
							? "w-8 bg-primary"
							: i < step
							? "w-2 bg-primary/60"
							: "w-2 bg-muted"
					}`}
				/>
			))}
		</div>
	);
};

export default StepProgress;
