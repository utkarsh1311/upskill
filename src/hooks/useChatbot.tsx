import { useCallback, useEffect, useState } from "react";
import vapi from "@/lib/vapi";

export type VoiceOption = "male" | "female";
export type PromptOption = "prompt1" | "prompt2";

interface CallDetail {
	timestamp: number;
	type: string;
	analysis: {
		summary: string;
	};
	artifact: {
		transcript: string;
	};
	assistant: {
		serverUrl: string;
		endCallMessage: string;
	};
	summary: string;
	transcript: string;
	startedAt: string;
	endedReason: string;
	durationMinutes: number;
}

interface ChatbotState {
	isCallStarted: boolean;
	selectedVoice: VoiceOption | null;
	selectedPrompt: PromptOption | null;
	isLoading: boolean;
	error: string | null;
	hasCallEnded: boolean;
	callDetails: CallDetail | null;
}

const RETRY_DELAY = 1000; // 1 second between retries
const INITIAL_DELAY = 2000; // Initial delay before first try

export const useChatbot = () => {
	const [callId, setCallId] = useState<string | null>(null);
	const [state, setState] = useState<ChatbotState>({
		callDetails: null,
		isCallStarted: false,
		selectedVoice: null,
		selectedPrompt: null,
		isLoading: false,
		error: null,
		hasCallEnded: false,
	});

	const transformCallDetail = result => ({
		timestamp: Date.now(),
		type: result.type,
		analysis: {
			summary: result.analysis?.summary || "",
		},
		artifact: {
			transcript: result.artifact?.transcript || "",
		},
		assistant: {
			serverUrl: result.assistant?.serverUrl || "",
			endCallMessage: result.assistant?.endCallMessage || "",
		},
		summary: result.summary || "",
		transcript: result.transcript || "",
		startedAt: result.startedAt,
		endedReason: result.endedReason || "",
		durationMinutes: result.durationMinutes || 0,
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

				const result = await response.json();

				if (result.status === "ended") {
					const data = transformCallDetail(result);
					console.log("data", data);
					setState(prev => ({
						...prev,
						callDetails: data,
					}));

					return result;
				}

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
				setState(prev => ({
					...prev,
					isLoading: false,
					isCallStarted: true,
					hasCallEnded: false,
				}));
			},
			"call-end": async () => {
				setState(prev => ({
					...prev,
					isCallStarted: false,
					hasCallEnded: true,
				}));

				if (!callId) {
					console.error("No callId available for fetching call details");
					return;
				}

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

			const call = await vapi.start("c341f28c-63da-4c62-82ab-af11bed7c13a");	
			if (call?.id) {
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
			callDetails: null,
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
