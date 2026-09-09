import { User } from "@/types";
import { getPersonalInfoItems } from "./userHelpers";

interface UserInfoGridProps {
	user: User;
}

export const UserInfoGrid = ({ user }: UserInfoGridProps) => {
	const items = getPersonalInfoItems(user);

	return (
		<div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
			{items.map(({ label, value, icon }) => (
				<div key={label} className="flex items-center gap-2">
					{icon}
					<div className="text-right font-medium">
						<span className="block text-muted-foreground">
							{label}:
						</span>
						{value}
					</div>
				</div>
			))}
		</div>
	);
};
