import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, 
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from
 } from '@apollo/client'
import { ErrorLink, onError } from "@apollo/client/link/error"
import { ContextProvider } from './context/Context.jsx'


const errorLink = onError(({graphqlErrors, networkError}) => {
  if(graphqlErrors) {
    graphqlErrors.map((message, location, path) => {
      alert(`Graphql error ${message}`)
    })
  }
})

const link = from ([
  errorLink,
  new HttpLink({uri: "http://localhost:8000/graphql"})
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
