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

const Stack = createStackNavigator()

const Drawer = createDrawerNavigator()

const AlbumDrawNavigation = (navigation) => {
	const dimensions = useWindowDimensions()
	return (
		<Drawer.Navigator
			drawerStyle={dimensions.width > 900 ? "permanent" : "front"}
			drawerStyle={{
				backgroundColor: "white",
				width: 240,
			}}
			drawerContent={(props) => {
				console.log(props)
				return <DrawContents {...props} />
			}}
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
			/>
		</Drawer.Navigator>
	)
}

export default ({ route }) => (
	<Stack.Navigator screenOptions={{ headerStyle: { ...stackStyles } }}>
		<Stack.Screen name="Messages" component={Messages} />
		<Stack.Screen name="Message" component={Message} />
		<Stack.Screen
			name="AlbumDrawNavigation"
			component={AlbumDrawNavigation}
			options={{
				title: "사진첩",
			}}
		/>
	</Stack.Navigator>
)
