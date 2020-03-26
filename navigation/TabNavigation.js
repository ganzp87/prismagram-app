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
import { View } from "react-native"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HomeStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Home"
			component={Home}
			options={{
				// headerTitle: (props) => "Text",
				headerRight: () => <MessagesLink />,
				title: "Home"
			}}
		/>
	</Stack.Navigator>
)
const NotificationStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Notification"
			component={Notifications}
			options={{ title: "Notification!" }}
		/>
	</Stack.Navigator>
)
const ProfileStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Profile"
			component={Profile}
			options={{ title: "Profile!" }}
		/>
	</Stack.Navigator>
)
const SearchStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Search"
			component={Search}
			options={{ title: "Search!" }}
		/>
	</Stack.Navigator>
)

export default ({ navigation }) => (
	<Tab.Navigator initialRouteName="Home">
		<Tab.Screen name="Home" component={HomeStack} />
		<Tab.Screen name="Notification" component={NotificationStack} />
		<Tab.Screen
			name="Add"
			component={View}
			listeners={{
				tabPress: (e) => {
					e.preventDefault()
					navigation.navigate("PhotoNavigation")
				}
			}}
		/>
		<Tab.Screen name="Profile" component={ProfileStack} />
		<Tab.Screen name="Search" component={SearchStack} />
	</Tab.Navigator>
)
