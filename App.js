import React, { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { AppLoading } from "expo"
import * as Font from "expo-font"
import { Asset } from "expo-asset"
import { AsyncStorage } from "react-native"
import { InMemoryCache } from "apollo-cache-inmemory"
import { persistCache } from "apollo-cache-persist"
import { ApolloProvider } from "react-apollo-hooks"
import { ThemeProvider } from "styled-components"
import styles from "./styles"
import NavController from "./components/NavController"
import { AuthProvider } from "./AuthContext"
import ApolloClient from "apollo-boost"
import clientState from "./apollo"

export default function App() {
	const [loaded, setLoaded] = useState(false)
	const [client, setClient] = useState(null)
	const [isLoggedIn, setLoggedIn] = useState(null)
	const [userEmail, setUserEail] = useState(null)

	const preLoad = async () => {
		// await AsyncStorage.clear()
		try {
			await Font.loadAsync({
				...Ionicons.font,
			})
			await Asset.loadAsync([require("./assets/logo.png")])
			const cache = new InMemoryCache()
			await persistCache({
				cache,
				storage: AsyncStorage,
			})
			// const client = new ApolloClient({
			// 	cache,
			// 	request: async (operation) => {
			// 		const token = await AsyncStorage.getItem("jwt")
			// 		return operation.setContext({
			// 			headers: { Authorization: `Bearer ${token}` }
			// 		})
			// 	},
			// 	uri: "http://192.168.0.3:4000"
			// })
			const client = clientState(cache)
			const isLoggedIn = await AsyncStorage.getItem("isLoggedIn")
			const userEmail = await AsyncStorage.getItem("email")
			if (!isLoggedIn || isLoggedIn === "false") {
				setLoggedIn(false)
				setUserEail("")
			} else {
				setLoggedIn(true)
				setUserEail(userEmail)
			}

			setLoaded(true)
			setClient(client)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		preLoad()
	}, [])
	// console.log(isLoggedIn)
	return loaded && client && isLoggedIn !== null ? (
		<ApolloProvider client={client}>
			<ThemeProvider theme={styles}>
				<AuthProvider isLoggedIn={isLoggedIn} userEmail={userEmail}>
					<NavController />
				</AuthProvider>
			</ThemeProvider>
		</ApolloProvider>
	) : (
		<AppLoading />
	)
}
