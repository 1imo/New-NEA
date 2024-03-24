// Import dependencies
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { GET_SEARCH_INSIGHTDATA } from "../GraphQL/Queries";
import ProfileInsight from "../components/ProfileInsight";

function Search() {
	// State for storing the search term
	const [searchTerm, setSearchTerm] = useState("");

	// Get the location object from react-router-dom
	const location = useLocation();

	// Get the state passed from the previous location
	const state = location.state;

	// Use the GET_SEARCH_INSIGHTDATA query to fetch search results
	const { loading, error, data } = useQuery(GET_SEARCH_INSIGHTDATA, {
		variables: {
			username: searchTerm,
			type: state.searchType || "main",
		},
	});

	// Handle error
	if (error) alert("Error Loading Search Results");

	// Render the component
	return (
		<>
			{/* Search input */}
			<input
				type="text"
				className="normInputScreen"
				placeholder={`|Search`}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginTop: 40 }}
			/>

			{/* Search results section */}
			<section
				style={{
					marginTop: 24,
					display: "flex",
					flexDirection: "column",
					rowGap: 16,
				}}
			>
				{/* Render search results if data is available and not loading */}
				{data && !loading
					? data?.getUserSearchResults?.map((res, index) => {
							return (
								<ProfileInsight
									username={res.username}
									name={res.name}
									id={res.id}
									key={index}
									reference={state.searchType || "main"}
								/>
							);
					  })
					: null}
			</section>
		</>
	);
}

export default Search;
