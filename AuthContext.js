import React, { createContext, useContext, useState } from "react"
import { AsyncStorage } from "react-native"

export const AuthContext = createContext()

export const AuthProvider = ({
	isLoggedIn: isLoggedInProp,
	userEmail: emailProp,
	children,
}) => {
	const [isLoggedIn, setisLoggedIn] = useState(isLoggedInProp)
	const [userEmail, setEmail] = useState(emailProp)
	const logUserIn = async (token, email) => {
		try {
			await AsyncStorage.setItem("isLoggedIn", "true")
			await AsyncStorage.setItem("jwt", token)
			await AsyncStorage.setItem("email", email)
			setisLoggedIn(true)
			setEmail(email)
		} catch (error) {
			console.log(error)
		}
	}

	const logUserOut = async () => {
		try {
			await AsyncStorage.setItem("isLoggedIn", "false")
			setisLoggedIn(false)
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<AuthContext.Provider
			value={{ isLoggedIn, logUserIn, logUserOut, userEmail }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useIsLogedIn = () => {
	const isLoggedIn = useContext(AuthContext)
	// console.log(isLoggedIn)
	return isLoggedIn.isLoggedIn
}

export const useLogIn = () => {
	const { logUserIn } = useContext(AuthContext)
	return logUserIn
}

export const useLogOut = () => {
	const { logUserOut } = useContext(AuthContext)
	return logUserOut
}

export const useSetEmail = (email) => {
	const { setEmail } = useContext(AuthContext)
}
