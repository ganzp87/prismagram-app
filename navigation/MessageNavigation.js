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
import PhotoList from "../screens/Photo/PhotoList"
import sendPhoto from "../screens/Photo/sendPhoto"
import EnlargeImage from "../components/EnlargeImage"

const Stack = createStackNavigator()

const Drawer = createDrawerNavigator()

const AlbumDrawNavigation = ({ route }) => {
	const dimensions = useWindowDimensions()
	// console.log(route)
	return (
		<Drawer.Navigator
			drawerStyle={dimensions.width > 900 ? "permanent" : "front"}
			drawerStyle={{
				backgroundColor: "white",
				width: 240,
			}}
			drawerContent={() => {
				// console.log(props)
				return <DrawContents {...route.params.params} />
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
			<Drawer.Screen
				name="PhotoList"
				component={PhotoList}
				options={{ title: "사진첩" }}
			/>
			<Drawer.Screen
				name="sendPhoto"
				component={sendPhoto}
				options={{ title: "사진 보내기" }}
			/>
		</Drawer.Navigator>
	)
}

export default ({ route }) => (
	<Stack.Navigator screenOptions={{ headerStyle: { ...stackStyles } }}>
		<Stack.Screen name="Messages" component={Messages} />
		<Stack.Screen name="Message" component={Message} />
		<Stack.Screen
			name="EnlargeImage"
			component={EnlargeImage}
			options={{ title: "사진 원본" }}
		/>
		<Stack.Screen
			name="AlbumDrawNavigation"
			component={AlbumDrawNavigation}
			options={{
				title: "사진첩",
			}}
		/>
	</Stack.Navigator>
)
