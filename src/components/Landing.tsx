
import { chat } from "@/assets";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, LineChart, MessageSquare } from "lucide-react";
import Background from "./Background";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Background />

      <div className="relative z-10 flex flex-row px-16 xl:px-8 md:px-4 max-w-7xl mx-auto gap-12 lg:flex-col lg:gap-8">
        {/* Left content section */}
        <div className="flex-1 flex flex-col justify-center pt-0 lg:items-center md:items-start">
          {/* Tag */}
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mt-12 mb-2 bg-blue-50 border-blue-200 text-blue-900 lg:mt-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Student Simulation
          </div>

          <h1 className="text-5xl xl:text-4xl lg:text-center md:text-left md:text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Master Communication Skills with
            <span className="block mt-2 text-7xl xl:text-6xl lg:text-center md:text-left md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              UpSkill Classes
            </span>
          </h1>

          <p className="text-xl xl:text-lg md:text-base text-gray-600 mb-8 max-w-xl lg:text-center md:text-left">
            Transform your personal and professional interaction with tailored,
            interactive coaching sessions
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-4 mb-8 w-full max-w-xl">
            <Card className="p-4 border-none bg-gray-50">
              <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Interactive simulations</h3>
              <p className="text-sm text-gray-600">
                Practice real life communication scenarios with AI-powered
                feedback
              </p>
            </Card>
            <Card className="p-4 border-none bg-gray-50">
              <LineChart className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Comprehensive Feedback</h3>
              <p className="text-sm text-gray-600">
                Receive actionable insights to improve your speaking, writing
                and presentation skills
              </p>
            </Card>
          </div>

          {/* CTA section */}
          <div className="flex items-center gap-6 mb-2">
            <Button 
              size="lg" 
              className="text-lg xl:text-base md:text-sm h-14 xl:h-12 px-8 xl:px-6 whitespace-nowrap"
            >
              <SignInButton>Start Teaching</SignInButton>
              <ArrowRight className="w-6 h-6 xl:w-5 xl:h-5 md:w-4 md:h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex-1 flex items-center justify-center min-h-[500px] xl:min-h-[400px] lg:min-h-[350px] md:min-h-[250px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr opacity-50 rounded-2xl" />
            <div className="w-full h-full p-4">
              <img 
                src={chat} 
                alt="Chat Interface" 
                className="w-full h-full object-contain lg:object-cover md:object-contain"
              />
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

export default Landing;