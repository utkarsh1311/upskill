import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import OngoingCall from "@/components/OngoingCall";
import { useChatbot } from "@/hooks/useChatbot";

const Chatbot = () => {
	
	const {
		isCallStarted,
		selectedVoice,
		selectedPrompt,
		isLoading,
		error,
		hasCallEnded,
		callSummary,
		handleCallStart,
		handleCallEnd,
		handleVoiceChange,
		handlePromptChange,
		handleReset,
		isStartDisabled,
	} = useChatbot();

	const renderContent = () => {
		if (isCallStarted) {
			return <OngoingCall handleCallEnd={handleCallEnd} />;
		}

		if (hasCallEnded) {
			if (callSummary) {
				return (
					<div className="px-4">
						<h2 className="text-2xl font-bold text-blue-500 mb-4">
							Call Evaluation Summary
						</h2>
						<div>
							<div className="prose max-h-[300px] overflow-y-auto mb-8 w-full rounded-md scrollbar ">
								<pre className="text-wrap bg-white text-black font-primary prose">
									{callSummary}
								</pre>
							</div>
						</div>
						<Button
							onClick={handleReset}
							size="lg"
							className="bg-gradient-to-r from-blue-500 to-indigo-500"
						>
							Start New Call
						</Button>
					</div>
				);
			} else {
				// return a loading spinner saying "Evaluation in progress..."
				return (
					<div className="text-center">
						<h2 className="text-2xl font-bold text-blue-600 mb-4">
							Evaluation in progress...
						</h2>
						<p className="text-gray-600 mb-8">
							Please wait while we evaluate the call.
						</p>
					</div>
				);
			}
		}

		return (
			<>
				<h1 className="text-3xl font-bold text-blue-500 mb-5">
					Configure the Chatbot
				</h1>
				<Select
					value={selectedVoice ?? undefined}
					onValueChange={handleVoiceChange}
				>
					<SelectTrigger className="p-6 shadow-sm">
						<SelectValue placeholder="Select the voice for the chatbot" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="male">Male Voice</SelectItem>
						<SelectItem value="female">Female Voice</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={selectedPrompt ?? undefined}
					onValueChange={handlePromptChange}
				>
					<SelectTrigger className="p-6 shadow-sm">
						<SelectValue placeholder="Select the prompt" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="prompt1">Prompt 1 for the student</SelectItem>
						<SelectItem value="prompt2">Prompt 2 for the student</SelectItem>
					</SelectContent>
				</Select>
				<Button
					onClick={handleCallStart}
					size="lg"
					disabled={isStartDisabled}
					className={`mt-10 text-lg w-full ${
						isStartDisabled
							? "bg-gray-300"
							: "bg-gradient-to-r from-blue-500 to-indigo-500"
					}`}
				>
					{isLoading ? "Starting Call..." : "Start Call"}
				</Button>
			</>
		);
	};

	return (
		<div className="col-span-2 rounded-md border bg-white shadow-md p-8 flex gap-4 flex-col justify-center h-[500px]">
			{error && (
				<div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
					{error}
				</div>
			)}

			{renderContent()}
		</div>
	);
};

export default Chatbot;
