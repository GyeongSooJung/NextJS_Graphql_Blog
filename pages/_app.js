import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import '../styles/Navbar.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  
  return(
      
   <ApolloProvider client={client}>
    <Component {...pageProps} />
   </ApolloProvider>
   
   )
}

export default MyApp;
