import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useState } from "react";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

type PlacesProps = {
  setSite: (position: google.maps.LatLngLiteral, name: string) => void;
};

export default function Places({ setSite }: PlacesProps) {
	const [text, setText] = useState("");

	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions
	} = usePlacesAutocomplete();

	const handleSelect = async (val: string) => {
		setValue(val, false);
		clearSuggestions();
		const results = await getGeocode({ address: val });
		const { lat, lng } = await getLatLng(results[0]);
		setSite({ lat, lng }, val);

	};

	const findLocation = () => {
		setText("Loading...");
		const success = async(position: any) => {

			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;

			const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
			const data = await response.json();
			const results = [
				data.city,
				data.principalSubdivisionCode.substring(data.principalSubdivisionCode.indexOf('-') + 1),
				data.countryName
			]
			handleSelect(results.join(", "))
			setText("");
			
		}

		const error = () => {
			setText("Unable to retrieve your location...");
		}
		navigator.geolocation.getCurrentPosition(success, error);
	}

	return (
		<div className="flex md:justify-between items-center flex-col md:flex-row md:mx-10">
			<Combobox onSelect={handleSelect} className="md:w-1/3 w-full px-3 md:px-0">
				<ComboboxInput
					value={value}
					onChange={(e) => setValue(e.target.value)}
					disabled={!ready}
					className="w-full p-2.5"
					placeholder="Search Location or address"
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === "OK" &&
							data.map(({ place_id, description }) => (
								<ComboboxOption key={place_id} value={description} />
							))
						}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>

			<div className="text-white md:mt-0 mt-5">
				<div className="md:flex md:items-center text-center">
					<h1 className="md-block hidden">{text}</h1>
					<button className="ml-4 border-solid border-2 border-indigo-600 py-2 px-4 rounded hover:text-black hover:bg-indigo-400" onClick={findLocation}>Locates yourself</button>
					<h1 className="block md:hidden">{text}</h1>
				</div>
			</div>

		</div>
	);
}