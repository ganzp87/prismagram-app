import React from "react"
import styled from "styled-components"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

// const View = styled.View`
// 	justify-content: center;
// 	align-items: center;
// 	flex: 1;
// `

const Text = styled.Text``

export default ({ navigation }) => (
	<View>
		<Text>Auth Home</Text>
		{/* <TouchableOpacity onPress={() => navigation.navigate("Login")}>
			<Text>Go to Login</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
			<Text>Go to Signup</Text>
		</TouchableOpacity> */}
	</View>
)
