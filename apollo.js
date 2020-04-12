import { ApolloClient } from "apollo-client"
import { withClientState } from "apollo-link-state"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink, split, Observable } from "apollo-link"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { AsyncStorage } from "react-native"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Updates } from "expo"

const httpOptions = {
	uri:
		process.env.NODE_ENV === "development"
			? "http://192.168.0.3:4000"
			: "https://prismagram-backendd.herokuapp.com/",
}
const wsOptions = {
	uri:
		process.env.NODE_ENV === "development"
			? `ws://192.168.0.3:4000/`
			: `wss://prismagram-backendd.herokuapp.com/`,
}

const httpLink = new HttpLink({
	uri: httpOptions.uri,
	credentials: "include",
})

const wsLink = new WebSocketLink({
	uri: wsOptions.uri,
	options: {
		reconnect: true,
	},
})

const request = async (operation) => {
	const token = await AsyncStorage.getItem("jwt")
	return operation.setContext({
		headers: { Authorization: `Bearer ${token}` },
	})
}
const requestLink = new ApolloLink(
	(operation, forward) =>
		new Observable((observer) => {
			let handle
			Promise.resolve(operation)
				.then((oper) => request(oper))
				.then(() => {
					handle = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					})
				})
				.catch(observer.error.bind(observer))

			return () => {
				if (handle) handle.unsubscribe()
			}
		})
)
const clientState = (cache) =>
	new ApolloClient({
		link: ApolloLink.from([
			onError(({ graphQLErrors, networkError }) => {
				if (graphQLErrors)
					graphQLErrors.forEach(
						async ({ message, locations, path }) => {
							console.log(
								`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
									locations
								)}, Path: ${path}`
							)
							if (
								message ===
								"You need to log in to perform this action"
							) {
								console.log("1111111111")
								await AsyncStorage.setItem(
									"isLoggedIn",
									"false"
								)
								await AsyncStorage.clear()
								Updates.reload()
							}
						}
					)
				if (networkError)
					console.log(`[Network error]: ${networkError}`)
			}),
			requestLink,
			withClientState({
				defaults: {
					isConnected: true,
				},
				resolvers: {
					Mutation: {
						updateNetworkStatus: (
							_,
							{ isConnected },
							{ cache }
						) => {
							cache.writeData({ data: { isConnected } })
							return null
						},
					},
				},
				cache,
			}),
			split(
				// split based on operation type
				({ query }) => {
					const definition = getMainDefinition(query)
					// console.log(definition.operation)
					return (
						definition.kind === "OperationDefinition" &&
						definition.operation === "subscription"
					)
				},
				wsLink,
				httpLink
			),
		]),
		cache,
		defaultOptions: {
			// watchQuery: { fetchPolicy: "network-only", errorPolicy: "all" },
			watchQuery: {
				fetchPolicy: "cache-and-network",
				errorPolicy: "ignore",
			},
			query: { fetchPolicy: "network-only", errorPolicy: "all" },
			mutate: { errorPolicy: "all" },
		},
	})

export default clientState
