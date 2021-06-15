import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faParking } from "@fortawesome/free-solid-svg-icons";
import { stationURL, availabilityURL } from "../constants/api";

function BikeList() {
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(function () {
		async function fetchData() {
			try {
				const responses = await Promise.all([fetch(stationURL), fetch(availabilityURL)]);
				const dataPromises = responses.map((response) => response.json());
				const data = await Promise.all(dataPromises);
				let stationArray = data[0].data.stations;
				let availabilityArray = data[1].data.stations;
				const finalArray = stationArray.map((stationArray) => ({
					...stationArray,
					...availabilityArray.find((availabilityArray) => availabilityArray.station_id === stationArray.station_id),
				}));
				setStations(finalArray);
			} catch (error) {
				setError("An error occurred during fetching of data. Please try again later.");
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return <div className="loader animation"></div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="bike-list">
			{stations.map(function (station) {
				return (
					<motion.div
						className="bike-card"
						key={station.station_id}
						initial={{ x: -500 }}
						animate={{ x: 0 }}
						transition={{ duration: 0.5, type: "spring" }}>
						<h4>{station.name}</h4>
						<div className="bike-card-status">
							<p>
								<FontAwesomeIcon className="icon" icon={faBicycle} />
								Ledige sykkler: {station.num_bikes_available}
							</p>
							<p>
								<FontAwesomeIcon className="icon" icon={faParking} />
								Ledige plasser: {station.num_docks_available}
							</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}

export default BikeList;
