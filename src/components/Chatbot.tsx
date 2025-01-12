import OngoingCall from "@/components/OngoingCall";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useChatbot } from "@/hooks/useChatbot";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import CallSummary from "./CallSummary";

const Chatbot = () => {
	const { user } = useUser();

	const {
		isCallStarted,
		currentAssistant,
		assistants,
		isLoading,
		error,
		hasCallEnded,
		callDetails,
		handleCallStart,
		handleCallEnd,
		handleAssistantChange,
		handleReset,
		isStartDisabled,
	} = useChatbot();

	useEffect(() => {
		const sendMail = async () => {
			try {
				const payload = {
					message: {
						...callDetails,
						email: user?.emailAddresses[0].emailAddress,
					},
				};
				const response = await fetch(import.meta.env.VITE_MAKE_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				if (response.status === 200) {
					console.log("Sent successfully");
				}

				if (!response.ok) {
					console.error("Failed to send email");
				}
			} catch (error) {
				console.error(
					error instanceof Error ? error.message : "Failed to send email"
				);
			}
		};

		if (hasCallEnded && callDetails) {
			sendMail();
		}
	}, [hasCallEnded, callDetails, user]);

	const renderContent = () => {
		if (isCallStarted) {
			return <OngoingCall handleCallEnd={handleCallEnd} />;
		}

		if (hasCallEnded) {
			if (callDetails) {
				return (
					<CallSummary callDetails={callDetails} handleReset={handleReset} />
				);
			} else {
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
			<div className="flex-1 flex flex-col justify-center">
				<h1 className="text-3xl font-bold text-blue-500 my-auto ">
					Configure the Chatbot
				</h1>
				<Select
					value={currentAssistant?.assistantId || ""}
					onValueChange={assistantId => {
						const selectedAssistant = assistants?.find(
							a => a.assistantId === assistantId
						);
						if (selectedAssistant) {
							handleAssistantChange(selectedAssistant);
						}
					}}
				>
					<SelectTrigger className="p-6 shadow-sm border-gray-200 hover:border-blue-400 transition-colors">
						<SelectValue placeholder="Select the voice for the assistant" />
					</SelectTrigger>
					<SelectContent>
						{assistants?.map(assistant => (
							<SelectItem
								key={assistant.assistantId}
								value={assistant.assistantId}
							>
								{assistant.assistantName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button
					onClick={handleCallStart}
					size="lg"
					disabled={isStartDisabled}
					className={`mt-10 text-lg w-full mb-auto ${
						isStartDisabled
							? "bg-gray-300"
							: "bg-gradient-to-r from-blue-500 to-indigo-500"
					}`}
				>
					{isLoading ? "Starting Call..." : "Start Call"}
				</Button>
			</div>
		);
	};

	return (
		<div className="col-span-2 rounded-md  border-2 shadow-sm py-2 px-8 flex gap-4 flex-col justify-center h-[500px] bg-white">
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
