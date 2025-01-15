import { avatar2 } from "@/assets";
import { useUser } from "@clerk/clerk-react";
import Background from "./Background";
import Chatbot from "./Chatbot";
import Navbar from "./Navbar";

const Dashboard = () => {
	const { user } = useUser();
	return (
		<div className="relative min-h-screen bg-white overflow-hidden">
			<Background />
			<div className="relative z-10 max-w-7xl mx-auto px-16 py-8 min-h-screen">
				<Navbar />
				<div className="mt-10">
					<p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-800">
						Welcome, {user.fullName}
					</p>
				<div className="w-full grid grid-cols-3 mt-10">
					<Chatbot />
					<div className="col-span-1 grid place-content-center md:hidden ">
						<img src={avatar2} className="" alt="placeholder" />
					</div>
				</div>
				</div>
			</div>
			<footer className="absolute inset-x-0 bottom-0 md:relative md:mt-8">
				<div className="bg-gray-800 text-white text-center py-3">
					<p className="text-sm px-4">
						&copy; 2025 UpSkill Classes. Empowering individuals to communicate
						with confidence.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default Dashboard;
