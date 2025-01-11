import { useCallback, useEffect, useState } from "react";
import vapi from "@/lib/vapi";

interface ChatAssistant {
  assistantId: string;
  assistantName: string;
}

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
  assistantName: string;
}

interface ChatbotState {
  isCallStarted: boolean;
  assistants: ChatAssistant[] | null;
  currentAssistant: ChatAssistant | null;
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
    currentAssistant: null,
    assistants: null,
    isLoading: false,
    error: null,
    hasCallEnded: false,
  });


	const calculateDurationInMinutes = (startedAt: string, endedAt: string): number => {
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const durationMs = end - start;
    return Number((durationMs / (1000 * 60)).toFixed(2)); // Convert to minutes and round to 2 decimal places
	};
	

  const transformCallDetail = (result) => ({
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
    durationMinutes: result.startedAt && result.endedAt 
		? calculateDurationInMinutes(result.startedAt, result.endedAt)
		: 0,
    assistantName: state.currentAssistant?.assistantName || "",
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
        console.log("result", result);

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
          error: error instanceof Error ? error.message : "Failed to fetch call details",
        }));
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  };

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch("https://api.vapi.ai/assistant", {
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

        const list = result.map((assistant) => ({
          assistantId: assistant.id,
          assistantName: assistant.name,
        }));

        console.log("list", list);
        setState(prev => ({
          ...prev,
          assistants: list,
        }));
      } catch (error) {
        console.error("Error fetching assistants:", error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to fetch assistants",
        }));
      }
    };

    fetchAssistants();
  }, []);

  useEffect(() => {
    type VapiEventNames = "speech-start" | "speech-end" | "call-start" | "call-end" | "error";

    const eventHandlers: Record<VapiEventNames, (...args) => void> = {
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
    if (!state.currentAssistant?.assistantId) {
      setState(prev => ({
        ...prev,
        error: "No assistant selected",
        isLoading: false,
      }));
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        hasCallEnded: false,
      }));

      const call = await vapi.start(state.currentAssistant.assistantId);
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
  }, [state.currentAssistant]);

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

  const handleAssistantChange = useCallback((assistant: ChatAssistant) => {
    setState(prev => ({
      ...prev,
      currentAssistant: assistant,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCallStarted: false,
      hasCallEnded: false,
      error: null,
      callDetails: null,
    }));
    setCallId(null);
  }, []);

  const isStartDisabled = !state.currentAssistant || state.isLoading;

  return {
    ...state,
    handleCallStart,
    handleCallEnd,
    handleAssistantChange,
    handleReset,
    isStartDisabled,
  };
};