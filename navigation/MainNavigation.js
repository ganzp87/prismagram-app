import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import TabNavigation from "./TabNavigation"
import PhotoNavigation from "./PhotoNavigation"
import MessageNavigation from "./MessageNavigation"
import { stackStyles } from "./config"

const MainNavigator = createStackNavigator()

export default () => (
	<NavigationContainer>
		<MainNavigator.Navigator
			initialRouteName="PhotoNavigation"
			headerMode="none"
			mode="card"
			screenOptions={{ headerStyle: { ...stackStyles } }}
		>
			<MainNavigator.Screen
				name="TabNavigation"
				component={TabNavigation}
			/>
			<MainNavigator.Screen
				name="PhotoNavigation"
				component={PhotoNavigation}
			/>
			<MainNavigator.Screen
				name="MessageNavigation"
				component={MessageNavigation}
			/>
		</MainNavigator.Navigator>
	</NavigationContainer>
)
