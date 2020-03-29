import "react-native-gesture-handler"
import React, { useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import Home from "../screens/Tabs/Home"
import Notifications from "../screens/Tabs/Notifications"
import Profile from "../screens/Tabs/Profile"
import Search from "../screens/Tabs/Search"
import Detail from "../screens/Detail"
import { createStackNavigator } from "@react-navigation/stack"
import MessagesLink from "../components/MessagesLink"
import { View, Platform } from "react-native"
import NavIcon from "../components/NavIcon"
import { stackStyles } from "./config"
import SearchBar from "../components/SearchBar"
import { createCompatNavigatorFactory } from "@react-navigation/compat"
import styles from "../styles"

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
				headerTitleAlign: "center",
				headerStyle: { ...stackStyles }
			}}
		/>
	</Stack.Navigator>
)
const NotificationStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Notification"
			component={Notifications}
			options={{
				title: "Notification!",
				headerTitleAlign: "center",
				headerStyle: { ...stackStyles }
			}}
		/>
	</Stack.Navigator>
)
const ProfileStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Profile"
			component={Profile}
			options={{
				title: "Profile!",
				headerTitleAlign: "center",
				headerStyle: { ...stackStyles }
			}}
		/>
	</Stack.Navigator>
)
const SearchStack = () => {
	const [textChange, setTextChange] = useState("")
	const navigation = useNavigation()
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { ...stackStyles }
			}}
		>
			<Stack.Screen
				name="Search"
				component={Search}
				options={{
					headerTitleAlign: "center",
					// headerStyle: { ...stackStyles },
					headerTitle: () => (
						<SearchBar
							value={textChange}
							onSubmit={() => {
								navigation.push("Search", {
									text: textChange
								})
							}}
							onChangeText={(text) => setTextChange(text)}
						/>
					)
				}}
			/>
			<Stack.Screen
				name="Detail"
				component={Detail}
				options={{
					headerPressColorAndroid: styles.darkBlueColor,
					headerTintColor: styles.blackColor,
					title: "Photo"
				}}
			/>
		</Stack.Navigator>
	)
}

export default ({ navigation }) => (
	<Tab.Navigator
		initialRouteName="Home"
		tabBarOptions={{
			showLabel: false,
			style: { ...stackStyles }
		}}
	>
		<Tab.Screen
			name="Home"
			component={HomeStack}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						focused={focused}
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
						focused={focused}
						name={
							Platform.OS === "ios"
								? focused
									? "ios-heart"
									: "ios-heart-empty"
								: focused
								? "md-heart"
								: "md-heart-empty"
						}
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
						focused={focused}
						name={Platform.OS === "ios" ? "ios-add" : "md-add"}
						size={26}
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
						focused={focused}
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
			initialParams="Search"
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<NavIcon
						focused={focused}
						name={
							Platform.OS === "ios" ? "ios-search" : "md-search"
						}
					/>
				)
			}}
		/>
	</Tab.Navigator>
)
