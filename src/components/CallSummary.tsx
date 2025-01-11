import React from "react";
import { Button } from "./ui/button";

type CallSummaryProps = {
	callDetails: {
		summary: string;
	};
	handleReset: () => void;
};

const CallSummary: React.FC<CallSummaryProps> = ({
	callDetails,
	handleReset,
}) => {
	return (
		<div className="px-4">
			<h2 className="text-2xl font-bold text-blue-500 mb-4">
				Call Evaluation Summary
			</h2>
			<div>
				<div className="prose max-h-[300px] overflow-y-auto mb-8 w-full rounded-md scrollbar ">
					<pre className="text-wrap bg-white text-black font-primary prose">
						{callDetails.summary}
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
};

export default CallSummary;
