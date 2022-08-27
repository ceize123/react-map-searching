import React, { useState, useEffect } from "react";

function Time({ site }: any) {

	const [timeData, setTimeData] = useState<{timezone: string, time: string}>({
			timezone: "",
			time: ""
	})
	useEffect(() => {
		const getTime = async () => {
			const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${site.lat}%2C${site.lng}&timestamp=0&key=${process.env.REACT_APP_GOOGLE_KEY}`);
			const timezone = await response.json();
	
			const formatter = await new Intl.DateTimeFormat([], {
				timeZone: timezone.timeZoneId,
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			});
			await setTimeData({ timezone: timezone.timeZoneId, time: formatter.format(new Date()) })
		}
		getTime();
	}, [site]);
	return (
		<div className="text-center text-orange-300 text-2xl my-4 font-bold">
			{timeData.timezone} - {timeData.time}
		</div>
	);
}

export default Time;