import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Chat from "./components/Dashboard";
import Landing from "./components/Landing";

const App = () => {

	return (
		<>
			<SignedIn>
				<Chat />
			</SignedIn>
			<SignedOut>
				<Landing />
			</SignedOut>
		</>
	);
};

export default App;
