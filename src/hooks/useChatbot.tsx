import { useCallback, useEffect, useState } from "react";
import vapi from "@/lib/vapi";

export type VoiceOption = "male" | "female";
export type PromptOption = "prompt1" | "prompt2";

interface ChatbotState {
	isCallStarted: boolean;
	selectedVoice: VoiceOption | null;
	selectedPrompt: PromptOption | null;
	isLoading: boolean;
	error: string | null;
	hasCallEnded: boolean;
	callSummary: string | null;
}

const RETRY_DELAY = 1000; // 1 second between retries
const INITIAL_DELAY = 2000; // Initial delay before first try

export const useChatbot = () => {
	const [callId, setCallId] = useState<string | null>(null);
	const [state, setState] = useState<ChatbotState>({
		callSummary: null,
		isCallStarted: false,
		selectedVoice: null,
		selectedPrompt: null,
		isLoading: false,
		error: null,
		hasCallEnded: false,
	});

	const fetchCallDetails = async (id: string): Promise<void> => {
		while (true) {
			try {
				const response = await fetch(`https://api.vapi.ai/call/${id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${import.meta.env.VITE_VAPI_PRIVATE_KEY}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}

				const callDetails = await response.json();
				console.log("Call details:", callDetails);

				if (callDetails.status === "ended") {
					setState(prev => ({
						...prev,
						callSummary: callDetails.summary,
					}));
					console.log("Call has ended successfully");
					return callDetails;
				}

				console.log(
					`Call status is ${callDetails.status}, waiting ${RETRY_DELAY}ms before retrying...`
				);
				await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
			} catch (error) {
				console.error("Error fetching call details:", error);
				setState(prev => ({
					...prev,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch call details",
				}));
				// Still wait before retrying even on error
				await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
			}
		}
	};

	// Event handler setup
	useEffect(() => {
		type VapiEventNames =
			| "speech-start"
			| "speech-end"
			| "call-start"
			| "call-end"
			| "error";

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const eventHandlers: Record<VapiEventNames, (...args: any[]) => void> = {
			"speech-start": () => {
				console.log("Assistant speech has started.");
			},
			"speech-end": () => {
				console.log("Assistant speech has ended.");
			},
			"call-start": () => {
				console.log("Call has started.");

				setState(prev => ({
					...prev,
					isLoading: false,
					isCallStarted: true,
					hasCallEnded: false,
				}));
			},
			"call-end": async () => {
				console.log("Call has ended on frontend.");

				setState(prev => ({
					...prev,
					isCallStarted: false,
					hasCallEnded: true,
				}));

				if (!callId) {
					console.error("No callId available for fetching call details");
					return;
				}

				// Wait for initial delay before starting to poll
				console.log(
					`Waiting ${INITIAL_DELAY}ms before starting to poll for call status...`
				);
				await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY));

				await fetchCallDetails(callId);
			},
			error: (error: Error) => {
				console.error("Call error:", error);
				setState(prev => ({
					...prev,
					error: error.message,
					isLoading: false,
					isCallStarted: false,
				}));
			},
		};

		Object.entries(eventHandlers).forEach(([event, handler]) => {
			vapi.on(event as VapiEventNames, handler);
		});

		return () => {
			Object.entries(eventHandlers).forEach(([event, handler]) => {
				vapi.off(event as VapiEventNames, handler);
			});
		};
	}, [callId]);

	const handleCallStart = useCallback(async () => {
		try {
			setState(prev => ({
				...prev,
				isLoading: true,
				error: null,
				hasCallEnded: false,
			}));

			const call = await vapi.start("88637c9a-3036-427f-86b2-573de84110c1");
			if (call?.id) {
				console.log("Call started with ID:", call.id);
				setCallId(call.id);
			} else {
				throw new Error("Failed to get call ID");
			}
		} catch (error) {
			setState(prev => ({
				...prev,
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			}));
		}
	}, []);

	const handleCallEnd = useCallback(() => {
		try {
			vapi.stop();
			setState(prev => ({
				...prev,
				isCallStarted: false,
				hasCallEnded: true,
			}));
		} catch (error) {
			setState(prev => ({
				...prev,
				error: error instanceof Error ? error.message : "An error occurred",
			}));
		}
	}, []);

	const handleVoiceChange = useCallback((voice: VoiceOption) => {
		setState(prev => ({ ...prev, selectedVoice: voice }));
	}, []);

	const handlePromptChange = useCallback((prompt: PromptOption) => {
		setState(prev => ({ ...prev, selectedPrompt: prompt }));
	}, []);

	const handleReset = useCallback(() => {
		setState(prev => ({
			...prev,
			isCallStarted: false,
			hasCallEnded: false,
			selectedVoice: null,
			selectedPrompt: null,
			error: null,
		}));
		setCallId(null);
	}, []);

	const isStartDisabled =
		!state.selectedVoice || !state.selectedPrompt || state.isLoading;

	return {
		...state,
		handleCallStart,
		handleCallEnd,
		handleVoiceChange,
		handlePromptChange,
		handleReset,
		isStartDisabled,
	};
};
