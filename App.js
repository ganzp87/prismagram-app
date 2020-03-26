import React, { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { AppLoading } from "expo"
import * as Font from "expo-font"
import { Asset } from "expo-asset"
import { AsyncStorage } from "react-native"
import { InMemoryCache } from "apollo-cache-inmemory"
import { persistCache } from "apollo-cache-persist"
import ApolloClient from "apollo-boost"
import options from "./apollo"
import { ApolloProvider } from "react-apollo-hooks"
import { ThemeProvider } from "styled-components"
import styles from "./styles"
import NavController from "./components/NavController"
import { AuthProvider } from "./AuthContext"

export default function App() {
	const [loaded, setLoaded] = useState(false)
	const [client, setClient] = useState(null)
	const [isLoggedIn, setLoggedIn] = useState(null)
	const preLoad = async () => {
		await AsyncStorage.clear()
		try {
			await Font.loadAsync({
				...Ionicons.font
			})
			await Asset.loadAsync([require("./assets/logo.png")])
			const cache = new InMemoryCache()
			await persistCache({
				cache,
				storage: AsyncStorage
			})
			const client = new ApolloClient({
				cache,
				...options
			})
			const isLoggedIn = await AsyncStorage.getItem("isLoggedIn")
			if (!isLoggedIn || isLoggedIn === "false") {
				setLoggedIn(false)
			} else {
				setLoggedIn(true)
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
	console.log(isLoggedIn)
	return loaded && client && isLoggedIn !== null ? (
		<ApolloProvider client={client}>
			<ThemeProvider theme={styles}>
				<AuthProvider isLoggedIn={isLoggedIn}>
					<NavController />
				</AuthProvider>
			</ThemeProvider>
		</ApolloProvider>
	) : (
		<AppLoading />
	)
}