import React, { useState } from "react"
import { TouchableWithoutFeedback, Keyboard, AsyncStorage } from "react-native"
import styled from "styled-components"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "react-apollo-hooks"
import { CONFIRM_SECRET, SAVE_PUSH_TOKEN } from "./AuthQueries"
import { useLogIn } from "../../AuthContext"
import { askPushMessagePermission } from "../../gePermission"

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
			email: route.params.email,
		},
	})
	const [savePushTokenMutation] = useMutation(SAVE_PUSH_TOKEN)
	// console.log(route)
	const handleConfirm = async () => {
		const { value } = confirmInput
		if (value === "" || !value.includes(" ")) {
			return Alert.alert("Invalid secret")
		}
		try {
			setloading(true)
			const {
				data: { confirmSecret },
			} = await confirmSecretMutation()
			if (confirmSecret !== "" || confirmSecret !== false) {
				console.log(confirmSecret)
				// await AsyncStorage.setItem("email", route.params.email)
				logIn(confirmSecret, route.params.email)
				const [
					notiPermission,
					pushToken,
				] = await askPushMessagePermission()
				console.log(pushToken)
				if (notiPermission) {
					const data = await savePushTokenMutation({
						variables: {
							email: route.params.email,
							pushToken,
						},
					})
					Alert.alert("알림 수신동의를 하셨습니다.")
					console.log(data)
				} else {
					Alert.alert("알림 수신거부를 하셨습니다.")
				}
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
