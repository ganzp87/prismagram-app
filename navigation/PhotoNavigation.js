import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import SelectPhoto from "../screens/Photo/SelectPhoto"
import TakePhoto from "../screens/Photo/TakePhoto"
import UploadPhoto from "../screens/Photo/UploadPhoto"
import { stackStyles } from "./config"
import styles from "../styles"

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const PhotoTabs = () => (
	<Tab.Navigator
		tabBarPosition="bottom"
		tabBarOptions={{
			...stackStyles,
			indicatorStyle: { backgroundColor: styles.blackColor },
			style: {
				backgroundColor: styles.lightGreyColor
				// paddingBottom: 20
			},
			labelStyle: {
				fontWeight: "bold"
			}
		}}
	>
		<Tab.Screen name="Select" component={SelectPhoto} />
		<Tab.Screen name="Take" component={TakePhoto} />
	</Tab.Navigator>
)

export default () => (
	<Stack.Navigator screenOptions={{ headerStyle: { ...stackStyles } }}>
		<Stack.Screen
			name=" "
			component={PhotoTabs}
			options={{
				title: "Choose Photo",
				headerTitleAlign: "center",
				headerBackTitle: null
			}}
		/>

		<Stack.Screen
			name="UploadPhoto"
			component={UploadPhoto}
			options={{ headerTintColor: styles.blackColor }}
		/>
	</Stack.Navigator>
)
