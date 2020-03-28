import "react-native-gesture-handler"
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Home from "../screens/Tabs/Home"
import Notifications from "../screens/Tabs/Notifications"
import Profile from "../screens/Tabs/Profile"
import Search from "../screens/Tabs/Search"
import { createStackNavigator } from "@react-navigation/stack"
import MessagesLink from "../components/MessagesLink"
import { View, Platform } from "react-native"
import NavIcon from "../components/NavIcon"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HomeStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Home"
			component={Home}
			options={{
				headerTitle: <NavIcon name="logo-instagram" size={36} />,
				headerRight: () => <MessagesLink />,
				// title: "Home",
				headerTitleAlign: "center"
			}}
		/>
	</Stack.Navigator>
)
const NotificationStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Notification"
			component={Notifications}
			options={{ title: "Notification!", headerTitleAlign: "center" }}
		/>
	</Stack.Navigator>
)
const ProfileStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Profile"
			component={Profile}
			options={{ title: "Profile!", headerTitleAlign: "center" }}
		/>
	</Stack.Navigator>
)
const SearchStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Search"
			component={Search}
			options={{ title: "Search!", headerTitleAlign: "center" }}
		/>
	</Stack.Navigator>
)

export default ({ navigation }) => (
	<Tab.Navigator initialRouteName="Home" tabBarOptions={{ showLabel: false }}>
		<Tab.Screen
			name="Home"
			component={HomeStack}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						name={Platform.OS === "ios" ? "ios-home" : "md-home"}
					/>
				)
			}}
		/>
		<Tab.Screen
			name="Notification"
			component={NotificationStack}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
					/>
				)
			}}
		/>
		<Tab.Screen
			name="Add"
			component={View}
			listeners={{
				tabPress: (e) => {
					e.preventDefault()
					navigation.navigate("PhotoNavigation")
				}
			}}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						name={Platform.OS === "ios" ? "ios-add" : "md-add"}
					/>
				)
			}}
		/>
		<Tab.Screen
			name="Profile"
			component={ProfileStack}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						name={
							Platform.OS === "ios" ? "ios-person" : "md-person"
						}
					/>
				)
			}}
		/>
		<Tab.Screen
			name="Search"
			component={SearchStack}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						name={
							Platform.OS === "ios" ? "ios-search" : "md-search"
						}
					/>
				)
			}}
		/>
	</Tab.Navigator>
)
