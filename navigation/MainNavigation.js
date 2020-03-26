import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import TabNavigation from "./TabNavigation"
import PhotoNavigation from "./PhotoNavigation"
import MessageNavigation from "./MessageNavigation"

const MainNavigator = createStackNavigator()

export default () => (
	<NavigationContainer>
		<MainNavigator.Navigator headerMode="none" mode="card">
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
