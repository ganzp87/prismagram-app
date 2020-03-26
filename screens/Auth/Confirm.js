import React, { useState } from "react"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import styled from "styled-components"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "react-apollo-hooks"
import { CONFIRM_SECRET } from "./AuthQueries"
import { useLogIn } from "../../AuthContext"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

export default ({ navigation, route }) => {
	const confirmInput = useInput("")
	const [loading, setloading] = useState(false)
	const logIn = useLogIn()
	const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
		variables: {
			secret: confirmInput.value,
			email: route.params.email
		}
	})
	// console.log(route)
	const handleConfirm = async () => {
		const { value } = confirmInput
		if (value === "" || !value.includes(" ")) {
			return Alert.alert("Invalid secret")
		}
		try {
			setloading(true)
			const {
				data: { confirmSecret }
			} = await confirmSecretMutation()
			if (confirmSecret !== "" || confirmSecret !== false) {
				console.log(confirmSecret)
				logIn(confirmSecret)
			} else {
				Alert.alert("Wrong secret!")
			}
		} catch (error) {
			Alert.alert("Can't confirm secret")
			console.log(error)
		} finally {
			setloading(false)
		}
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput
					{...confirmInput}
					placeholder="Secret"
					returnKeyType="send"
					onSubmitEditing={handleConfirm}
					autoCorrect={false}
				/>
				<AuthButton
					onPress={handleConfirm}
					text="Confirm"
					loading={loading}
				></AuthButton>
			</View>
		</TouchableWithoutFeedback>
	)
}
