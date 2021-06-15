import "./App.css";
import { motion } from "framer-motion";
import BikeList from "./components/BikeList";

function App() {
	return (
		<div className="App">
			<motion.h1 initial={{ y: -250 }} animate={{ y: 0 }} transition={{ duration: 0.5, type: "spring" }}>
				Oslo Bysykkel Stasjoner
			</motion.h1>
			<BikeList />
		</div>
	);
}

export default App;
