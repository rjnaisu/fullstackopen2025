import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('bookapp-user-token')

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }))

  return forward(operation)
})

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
