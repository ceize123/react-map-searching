import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Table from "./table";
import Time from "./time";


type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
	// const [site, setSite] = useState<LatLngLiteral>();
	// const [sites, setSites] = useState<LatLngLiteral[]>([]);
	const [site, setSite] = useState<{p: LatLngLiteral, name: string}>();
	const [sites, setSites] = useState<{p: LatLngLiteral, name: string}[]>([]);
	const mapRef = useRef<GoogleMap>();
	const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);

	const options = useMemo<MapOptions>(() => ({
		mapId: "dca9ff1f25ac4e36",
		disableDefaultUI: true,
		clickableIcons: false,
	}), [])

	useEffect(() => {
		if (site !== undefined) {
			// setSites(sites => sites.concat(site));
			setSites(sites => [site, ...sites]);
		}
	}, [site]);

	// avoid duplicate generating a new map every time the component renders
	const onLoad = useCallback((map: any) => (mapRef.current = map), []);

	return (
		<div className="container">
			<Places setSite={(position, name) => {
				setSite({p:position, name: name}); // pass the state
				mapRef.current?.panTo(position); // move the map to that location
			}} />
			<div className="map flex justify-center md:px-10 mt-6">
				<GoogleMap zoom={10}
					center={center}
					mapContainerClassName="map-container"
					options={options}
					onLoad={onLoad}
				>
					{/* {site && <Marker position={site} />} */}
					{sites.length &&
						sites.map((site, idx) => (
							< Marker key={idx} position={site.p} />
						))
					}
				</GoogleMap>
			</div>
			{sites.length ?
				<>
					<Time site={sites[0].p} />
				<Table sites={sites}
					setSites={(site: any) => {
						setSites(site);
					}} 
					/>
				</>
				: <></>
			}
		</div>
	);
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};