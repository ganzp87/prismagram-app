import "react-native-gesture-handler"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import AuthHome from "../screens/Auth/AuthHome"
import SignUp from "../screens/Auth/SignUp"
import Login from "../screens/Auth/Login"
import Confirm from "../screens/Auth/Confirm"
import { Text, View, TouchableOpacity } from "react-native"

const Stack = createStackNavigator()

export default () => (
	<NavigationContainer>
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen name="AuthHome" component={AuthHome} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="SignUp" component={SignUp} />
			<Stack.Screen name="Confirm" component={Confirm} />
		</Stack.Navigator>
	</NavigationContainer>
)
