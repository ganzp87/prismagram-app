import React from "react"
import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from "@react-navigation/drawer"
import { Text } from "react-native"

export default (props) => {
	// const props = route.params?.album
	// console.log(route)
	console.log("test")
	console.log(props)
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props}>
				<DrawerItem
					label="Help"
					onPress={() =>
						Linking.openUrl("https://mywebsite.com/help")
					}
				/>
				<Text>H2</Text>
			</DrawerItemList>
		</DrawerContentScrollView>
	)
}
