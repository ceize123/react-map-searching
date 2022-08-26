import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import Places from "./places";
import Table from "./table";
import Time from "./time";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export default function Map() {

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