import { useState, useEffect } from "react";
import { stationURL, availabilityURL } from "../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faParking } from "@fortawesome/free-solid-svg-icons";

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
					...availabilityArray.find((sa) => sa.station_id === stationArray.station_id),
				}));
				setStations(finalArray);
			} catch (error) {
				setError(error.toString());
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
		return <div>An error occurred: {error}</div>;
	}

	return (
		<div className="bike-list">
			{stations.map(function (station) {
				return (
					<div className="bike-card" key={station.station_id}>
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
					</div>
				);
			})}
		</div>
	);
}

export default BikeList;
