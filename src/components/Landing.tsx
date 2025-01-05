import { LineChart, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import Background from "./Background";
import { chat } from "@/assets";
import { Button } from "./ui/button";
import { SignInButton } from "@clerk/clerk-react";

const Landing = () => {
	return (
		<div className="relative min-h-screen bg-white overflow-hidden">
			<Background />

			<div className="relative z-10 flex flex-row min-h-screen px-16 max-w-7xl mx-auto gap-12 lg:flex-col md:px-8">
				{/* Left content section */}
				<div className="flex-1 flex flex-col justify-center pt-0 lg:pt-20 items-baseline">
					{/* Tag */}
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mt-8 mb-2 bg-blue-50 border-blue-200 text-blue-900">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Student Simulation
          </div>

					<h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
						Practice teaching with
						<span className="block mt-2 text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
							Australian students
						</span>
					</h1>

					<p className="text-xl text-gray-600 mb-8 max-w-xl">
						Train and improve your teaching skills through interactive
						conversations with our AI student. Get instant feedback and detailed
						improvement insights.
					</p>

					{/* Feature cards */}
					<div className="grid grid-cols-3 gap-4 mb-8 md:grid-cols-1">
						<Card className="p-4 border-none bg-gray-50">
							<MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
							<h3 className="font-semibold mb-1">Realistic Dialogue</h3>
							<p className="text-sm text-gray-600">
								Chat with AI students that respond like real Aussie kids
							</p>
						</Card>
						<Card className="p-4 border-none bg-gray-50">
							<LineChart className="h-6 w-6 text-blue-600 mb-2" />
							<h3 className="font-semibold mb-1">Detailed Analysis</h3>
							<p className="text-sm text-gray-600">
								Get comprehensive feedback after each session
							</p>
						</Card>
					</div>

					{/* CTA section */}
					<div className="flex items-center gap-6">
						<Button size="lg" className="text-lg h-14 px-8">
							<SignInButton>Start Teaching</SignInButton>
						</Button>
						<p className="text-sm text-gray-500">Free for UpSkill teachers</p>
					</div>
				</div>

				{/* Right section */}
				<div className="flex-1 flex items-center justify-center min-h-[500px] ">
					<div className="relative w-full h-full flex items-center justify-center text-gray-300">
						<div className="absolute inset-0 bg-gradient-to-tr opacity-50 rounded-2xl" />
						<div className="text-sm">
							<img src={chat} alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
