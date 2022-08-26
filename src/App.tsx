import React from 'react';
import { useLoadScript } from "@react-google-maps/api";
import Map from "./components/map";

function App() {
  const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
		libraries: ["places"]
	})

	if (!isLoaded) return <div>Loading...</div>;
	return (
		<div className="APP flex justify-center my-10">
			<Map />
		</div>
	);
}

export default App;
