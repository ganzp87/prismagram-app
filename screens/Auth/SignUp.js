import React, { useState } from "react"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import styled from "styled-components"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "react-apollo-hooks"
import { CREATE_ACCOUNT } from "./AuthQueries"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

export default ({ navigation, route }) => {
	const fNameInput = useInput("")
	const lNameInput = useInput("")
	const emailInput = useInput(route.params?.email, route.params)
	const userNameInput = useInput("")
	const [loading, setloading] = useState(false)
	const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
		variables: {
			firstName: fNameInput.value,
			lastName: lNameInput.value,
			email: emailInput.value,
			username: userNameInput.value
		}
	})

	const handleSignUp = async () => {
		const { value: email } = emailInput
		const { value: fName } = fNameInput
		const { value: lName } = lNameInput
		const { value: username } = userNameInput
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (fName === "") {
			return Alert.alert("I need your first name")
		}
		if (lName === "") {
			return Alert.alert("I need your last name")
		}
		if (email === "") {
			return Alert.alert("Email can't be empty")
		} else if (!email.includes("@") || !email.includes(".")) {
			return Alert.alert("Please write an right email")
		} else if (!emailRegex.test(email)) {
			return Alert.alert("That email is invalid")
		}
		if (username === "") {
			return Alert.alert("Invalid username")
		}
		try {
			setloading(true)
			const {
				data: { createAccount }
			} = await createAccountMutation(email, fName, lName, username)
			console.log("createAccount", createAccount)
			if (createAccount) {
				Alert.alert("Account created", "Log in now!")
				navigation.navigate("Login", { email })
				return
			}
		} catch (error) {
			Alert.alert(
				"This username / email is already taken",
				"Login instead"
			)
			navigation.navigate("Login", { email })
			console.log(error)
		} finally {
			setloading(false)
		}
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput
					{...fNameInput}
					placeholder="Frist name"
					autoCapitalize="words"
					autoCorrect={true}
				/>
				<AuthInput
					{...lNameInput}
					placeholder="Last name"
					autoCapitalize="words"
					autoCorrect={true}
				/>
				<AuthInput
					{...emailInput}
					placeholder="Email"
					keyboardType="email-address"
					returnKeyType="send"
					autoCorrect={false}
				/>
				<AuthInput
					{...userNameInput}
					placeholder="User name"
					returnKeyType="send"
					autoCorrect={false}
				/>
				<AuthButton
					onPress={handleSignUp}
					text="Sign Up"
					loading={loading}
				></AuthButton>
			</View>
		</TouchableWithoutFeedback>
	)
}
