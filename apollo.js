import { withClientState } from "apollo-link-state"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink, split } from "apollo-link"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"

const httpLink = new HttpLink({
	uri: "https://localhost:4000",
	credentials: "same-origin"
})

const wsLink = new WebSocketLink({
	uri: `ws://localhost:4000/`,
	options: {
		reconnect: true
	}
})

const request = async (operation) => {
	const token = await AsyncStorage.getItem("jwt")
	return operation.setContext({
		headers: { Authorization: `Bearer ${token}` }
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
						complete: observer.complete.bind(observer)
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
					graphQLErrors.forEach(({ message, locations, path }) =>
						console.log(
							`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
						)
					)
				if (networkError)
					console.log(`[Network error]: ${networkError}`)
			}),
			requestLink,
			withClientState({
				defaults: {
					isConnected: true
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
						}
					}
				},
				cache
			}),
			split(
				// split based on operation type
				({ query }) => {
					const definition = getMainDefinition(query)
					return (
						definition.kind === "OperationDefinition" &&
						definition.operation === "subscription"
					)
				},
				wsLink,
				httpLink
			)
		]),
		cache
	})

const options = {
	uri:
		process.env.NODE_ENV === "development"
			? "http://192.168.0.3:4000"
			: "https://prismagram-backendd.herokuapp.com/"
}

export default clientState
