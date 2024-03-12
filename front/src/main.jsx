// Import dependencies
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
} from "@apollo/client";
import { ErrorLink, onError } from "@apollo/client/link/error";
import { ContextProvider } from "./context/Context.jsx";

// Create an error link to handle GraphQL errors
const errorLink = onError(({ graphqlErrors, networkError }) => {
	if (graphqlErrors) {
		graphqlErrors.map((message, location, path) => {
			alert(`Graphql error ${message}`);
		});
	}
});

// Create an HTTP link to connect to the GraphQL server
const link = from([
	errorLink,
	new HttpLink({ uri: "http://localhost:8000/graphql" }),
]);

// Create an instance of ApolloClient
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link,
});

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<ContextProvider>
				<App />
			</ContextProvider>
		</ApolloProvider>
	</React.StrictMode>
);
