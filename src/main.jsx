import { StrictMode } from "react";
import { onError } from "@apollo/client/link/error";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import App from "./App.jsx";
import "./index.css";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors }) => {
  console.log("errorLink fired", graphQLErrors)
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
        console.log("error message:", err.message)
      if (err.message === "You must be logged in") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }
  }
})

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
        List: {
            fields: {
                tasks: {
                    merge(existing, incoming) {
                        return incoming;
                    }
                }
            }
          },
        Task: {
          fields: {
            dueDate: {
              merge(existings, incoming) {
                return incoming
              }
            }
          }
        }
      }
  }),
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  //* </StrictMode> 
);
