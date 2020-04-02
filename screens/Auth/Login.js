import React, { useState } from "react"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import styled from "styled-components"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "react-apollo-hooks"
import { LOG_IN } from "./AuthQueries"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

export default ({ navigation, route }) => {
	const emailInput = useInput(route.params?.email, route.params)
	const [loading, setloading] = useState(false)
	const [requestSecretMutation] = useMutation(LOG_IN, {
		variables: {
			email: emailInput.value
		}
	})
	const handleLogin = async () => {
		const { value } = emailInput
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (value === "") {
			return Alert.alert("Email can't be empty")
		} else if (!value.includes("@") || !value.includes(".")) {
			return Alert.alert("Please write an email")
		} else if (!emailRegex.test(value)) {
			return Alert.alert("That email is invalid")
		}
		try {
			setloading(true)
			const {
				data: { requestSecret }
			} = await requestSecretMutation()
			if (requestSecret) {
				Alert.alert("Check your email")
				navigation.navigate("Confirm", { email: value })
				return
			} else {
				Alert.alert("Account not found")
				navigation.navigate("SignUp", { email: value })
			}
		} catch (error) {
			Alert.alert("Can't log in now")
			console.log(error)
		} finally {
			setloading(false)
		}
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput
					{...emailInput}
					placeholder="Email"
					keyboardType="email-address"
					returnKeyType="send"
					onSubmitEditing={handleLogin}
					autoCorrect={false}
				/>
				<AuthButton
					onPress={handleLogin}
					text="Log In"
					loading={loading}
				></AuthButton>
			</View>
		</TouchableWithoutFeedback>
	)
}
