import React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { useIsLogedIn, useLogIn, useLogOut } from "../AuthContext"
import AuthNavigation from "../navigation/AuthNavigation"
import MainNavigation from "../navigation/MainNavigation"

export default () => {
	const isLoggedIn = useIsLogedIn()
	// const isLoggedIn = true
	const logIn = useLogIn()
	const logOut = useLogOut()
	return (
		<View style={{ flex: 1 }}>
			{/* {isLoggedIn ? <MainNavigation /> : <AuthNavigation />} */}
			<MainNavigation />
		</View>
	)
}
