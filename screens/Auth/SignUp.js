import React, { useState } from "react"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import styled from "styled-components"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "react-apollo-hooks"
import { CREATE_ACCOUNT } from "./AuthQueries"
import * as Facebook from "expo-facebook"
import * as Google from "expo-google-app-auth"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

const FBContainer = styled.View`
	margin-top: 25;
	padding-top: 25;
	border-top-width: 1px;
	border-color: ${(props) => props.theme.lightGreyColor};
	border-style: solid;
`

const GGContainer = styled.View`
	margin-top: 10;
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
	const FBlogIn = async () => {
		try {
			setloading(true)
			await Facebook.initializeAsync("250032782207799")
			const {
				type,
				token,
				expires,
				permissions,
				declinedPermissions
			} = await Facebook.logInWithReadPermissionsAsync({
				permissions: ["public_profile", "email"]
			})
			if (type === "success") {
				const response = await fetch(
					`https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email,name`
				)
				const {
					last_name,
					first_name,
					email,
					name
				} = await response.json()
				fNameInput.setvalue(first_name)
				lNameInput.setvalue(last_name)
				emailInput.setvalue(email)
				userNameInput.setvalue(email.split("@")[0])
				console.log(last_name, first_name, email, name)
				// Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`)
				setloading(false)
			} else {
				// type === 'cancel'
			}
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`)
		}
	}

	const GoogleLogin = async () => {
		try {
			setloading(true)
			const GOOGLE_ID =
				"888363145388-dhbp5so1mrbdvaes4a8kbkhg6rkg69nv.apps.googleusercontent.com"
			const result = await Google.logInAsync({
				androidClientId: GOOGLE_ID,
				// iosClientId: GOOGLE_ID,
				scopes: ["profile", "email"]
			})

			if (result.type === "success") {
				const user = await fetch(
					"https://www.googleapis.com/userinfo/v2/me",
					{
						headers: {
							Authorization: `Bearer ${result.accessToken}`
						}
					}
				)
				const {
					family_name,
					given_name,
					email,
					name
				} = await user.json()
				fNameInput.setvalue(given_name)
				lNameInput.setvalue(family_name)
				emailInput.setvalue(email)
				userNameInput.setvalue(email.split("@")[0])
				console.log(family_name, given_name, email, name)
				setloading(false)
				// console.log(data)
			} else {
				return { cancelled: true }
			}
		} catch (e) {
			return { error: true }
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
				<FBContainer>
					<AuthButton
						onPress={FBlogIn}
						loading={false}
						text="Connect Facebook"
						bgColor={"#2D4DA7"}
					/>
				</FBContainer>
				<GGContainer>
					<AuthButton
						onPress={GoogleLogin}
						loading={false}
						text="Connect Google"
						bgColor={"#db4a39"}
					/>
				</GGContainer>
			</View>
		</TouchableWithoutFeedback>
	)
}
