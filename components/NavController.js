import React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { useIsLogedIn, useLogIn, useLogOut } from "../AuthContext"
import AuthNavigation from "../navigation/AuthNavigation"

export default () => {
	const isLoggedIn = useIsLogedIn()
	const logIn = useLogIn()
	const logOut = useLogOut()
	console.log(isLoggedIn.isLoggedIn)
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			{isLoggedIn.isLoggedIn ? (
				<TouchableOpacity onPress={logOut}>
					<Text>Log Out</Text>
				</TouchableOpacity>
			) : (
				<AuthNavigation />
				// <Text>TEXT</Text>
			)}
		</View>
	)
}
