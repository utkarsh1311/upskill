import talk from "@/assets/talking.json";
import { Fade } from "react-awesome-reveal";
import Lottie from "react-lottie";
import { Button } from "./ui/button";


const OngoingCall = ({ handleCallEnd }: { handleCallEnd: () => void }) => {
	return (
		<Fade cascade>
			<p className="text-center font-bold text-blue-400 text-xl">
				Your call has started.
			</p>
			<div className="">
				<Lottie
					width={330}
					options={{
						loop: true,
						autoplay: true,
						animationData: talk,
					}}
				/>
			</div>
			<Button
				onClick={handleCallEnd}
				size="lg"
				className="text-lg bg-gradient-to-r from-red-600 to-pink-600 w-full"
			>
				End Call
			</Button>
		</Fade>
	);
};

export default OngoingCall;
