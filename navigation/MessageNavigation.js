import React from "react"
import { useWindowDimensions } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Messages from "../screens/Messages/Messages"
import Message from "../screens/Messages/Message"
import { stackStyles } from "./config"
import SelectPhoto from "../screens/Photo/SelectPhoto"
import AlbumList from "../screens/Photo/AlbumList"
import DrawContents from "../screens/Photo/DrawContents"
import { useNavigation } from "@react-navigation/native"

const Stack = createStackNavigator()

const Drawer = createDrawerNavigator()

const AlbumDrawNavigation = (props) => {
	const dimensions = useWindowDimensions()
	const navigation = useNavigation()
	return (
		<Drawer.Navigator
			drawerStyle={dimensions.width > 900 ? "permanent" : "front"}
			drawerStyle={{
				backgroundColor: "white",
				width: 240,
			}}
			// drawerContent={() => {
			// 	// console.log(props)
			// 	return DrawContents
			// }}
		>
			<Drawer.Screen
				name="SelectPhoto"
				component={SelectPhoto}
				options={{ title: "전체 사진" }}
			/>
			<Drawer.Screen
				name="AlbumList"
				component={AlbumList}
				options={{ title: "폴더별 사진" }}
				listeners={
					(props) => console.log(props)
					// navigation.dispatch("AlbumList", { nav: navigation.route })
				}
			/>
		</Drawer.Navigator>
	)
}

export default ({ route }) => (
	<Stack.Navigator screenOptions={{ headerStyle: { ...stackStyles } }}>
		<Stack.Screen name="Messages" component={Messages} />
		<Stack.Screen name="Message" component={Message} />
		{/* <Stack.Screen name="SelectPhoto" component={SelectPhoto} /> */}
		<Stack.Screen
			name="AlbumDrawNavigation"
			component={AlbumDrawNavigation}
			options={{
				title: "사진첩",
			}}
			listeners={{
				focus: (e) => {
					console.log(route)
				},
			}}
		/>
	</Stack.Navigator>
)
