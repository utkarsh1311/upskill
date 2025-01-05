import { SignOutButton, useUser } from "@clerk/clerk-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
	const { user } = useUser();

	return (
		<div className="flex justify-between ">
			<span className="text-3xl font-extrabold font-mono">UpSkill Classes</span>
			<DropdownMenu>
				<DropdownMenuTrigger className="outline-none">
					<img
						className="w-12 h-12 rounded-full "
						src={user?.imageUrl}
						alt="user image"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<SignOutButton>Sign Out</SignOutButton>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default Navbar;
