import React, { useState } from "react";
import { Pagination } from "react-pagination-bar";
import 'react-pagination-bar/dist/index.css'

// type PlacesProps = {
//   sites: (position: google.maps.LatLngLiteral[]) => void;
// };

function Table({ sites, setSites }: any) {
	const [currentPage, setCurrentPage] = useState<number>(1);
	// const [removeList, setRemoveList] = useState<typeof sites[]>();
	const [removeList, setRemoveList] = useState<any[]>();
	const pagePostsLimit = 10;
	
	const handleDelete = () => {
		// console.log(removeList);
		// console.log(sites.filter((site: any, idx: any) => !removeList?.includes(idx)));
		setSites(sites.filter((site: any, idx: any) => !removeList?.includes(idx)));
		setRemoveList([])
	}

	const handleSelect = (e: any, idx: number) => {
		if (e.target.checked) {
			// const val = e.target.value;
			// const temp = sites.slice(idx, idx + 1);

			// console.log(temp[0].name);
			// console.log(sites.filter((site: any) => site.name !== temp[0].name))

			// setSites(sites.filter((site: any) => site.name !== temp[0].name));
			// e.target.checked = false;

			if (removeList?.length) {
				setRemoveList((list: any) => [...list, idx]);
				// setRemoveList((list: any) => [...list, sites.slice(idx, idx + 1)])
			} else {
				// setRemoveList(sites.slice(idx, idx + 1));
				setRemoveList([idx])
			}
		} else {
			if (removeList?.length) {
				setRemoveList(removeList.filter((index: any) => index !== idx))
			}
		}
	}

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setRemoveList([]);
	}

	// useEffect(() => {
	// 	setRemoveList([]);
	// }, [currentPage]);
	return (
		<div className="text-center md:px-10 px-3">
			<div className="text-white border-2 mb-5">
			{sites.slice(
			(currentPage - 1) * pagePostsLimit,
			(currentPage - 1) * pagePostsLimit + pagePostsLimit
				).map((site: any, idx: number) => (
				<div key={idx} className="my-4 mx-5 text-start">
					<input
						id={`location-${idx + ((currentPage - 1) * pagePostsLimit)}`}
						aria-describedby="location-description"
						name={`location-${idx + ((currentPage - 1) * pagePostsLimit)}`}
						type="checkbox"
						value={idx + ((currentPage - 1) * pagePostsLimit)}
						onChange={(e) => handleSelect(e, idx + ((currentPage - 1) * pagePostsLimit))}
						checked={removeList?.includes(idx + ((currentPage - 1) * pagePostsLimit))}
						className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
						/>
					<div className="inline-block">
						<label htmlFor={`location-${idx + ((currentPage - 1) * pagePostsLimit)}`} className="font-medium ml-4 hover:text-indigo-500 cursor-pointer">
							{site.name}
						</label>
					</div>
				</div>
			))}
			</div>
			{removeList?.length ?
				<div className="text-start">
					<button className="text-white border-solid border-2 border-red-600 py-2 px-4 rounded hover:text-black hover:bg-red-400"
						onClick={handleDelete}
						>Delete
					</button>
				</div>
				: <></>
			}
			<Pagination
				currentPage={currentPage}
				itemsPerPage={pagePostsLimit}
				// onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
				onPageChange={(pageNumber) => handlePageChange(pageNumber)}
				totalItems={sites.length}
				pageNeighbours={2}
			/>
		</div>
	);
}

export default Table;