import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import AlbumList from "../screens/Photo/AlbumList"
import SelectPhoto from "../screens/Photo/SelectPhoto"

const Drawer = createDrawerNavigator()

export default () => {
	const dimensions = useWindowDimensions()
	return (
		<Drawer.Navigator
			drawerContent={(props) => AlbumList(props)}
			drawerStyle={dimensions.width > 900 ? "permanent" : "front"}
			drawerStyle={{
				backgroundColor: "#c6cbef",
				width: 240,
			}}
		>
			<Drawer.Screen name="AlbumList" component={AlbumList} />
		</Drawer.Navigator>
	)
}
