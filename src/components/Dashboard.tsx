import { avatar2 } from "@/assets";
import { useUser } from "@clerk/clerk-react";
import Background from "./Background";
import ChatbotConfig from "./Chatbot";
import Navbar from "./Navbar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dashboard = () => {
	const { user } = useUser();
	return (
		<div className="relative min-h-screen bg-white overflow-hidden">
			<Background />
			<div className="relative z-10 max-w-7xl mx-auto px-16 py-8 min-h-screen">
				<Navbar />
				<div className="mt-10">
					<p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-800">
						Welcome {user?.firstName}!
					</p>
				</div>
				<div className="w-full grid grid-cols-3 mt-10">
					<ChatbotConfig />
					<div className="col-span-1 grid place-content-center">
						<img src={avatar2} className="w-4/5" alt="placeholder" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
