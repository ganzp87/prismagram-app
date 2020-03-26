import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import SelectPhoto from "../screens/Photo/SelectPhoto"
import TakePhoto from "../screens/Photo/TakePhoto"
import UploadPhoto from "../screens/Photo/UploadPhoto"

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const PhotoTabs = () => (
	<Tab.Navigator tabBarPosition="bottom">
		<Tab.Screen name="SelectPhoto" component={SelectPhoto} />
		<Tab.Screen name="TakePhoto" component={TakePhoto} />
	</Tab.Navigator>
)

export default () => (
	<Stack.Navigator>
		<Stack.Screen name=" " component={PhotoTabs} />
		<Stack.Screen name="UploadPhoto" component={UploadPhoto} />
	</Stack.Navigator>
)
