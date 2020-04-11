import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import AlbumList from "../screens/Photo/AlbumList"
import SelectPhoto from "../screens/Photo/SelectPhoto"
import { NavigationContainer } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import DrawContents from "../screens/Photo/DrawContents"

const Drawer = createDrawerNavigator()

export default () => {
	const dimensions = useWindowDimensions()
	return (
		<NavigationContainer independent={true}>
			<Drawer.Navigator
				initialRouteName="SelectPhoto"
				drawerStyle={dimensions.width > 900 ? "permanent" : "front"}
				drawerStyle={{
					backgroundColor: "#c6cbef",
					width: 240,
				}}
				drawerContent={() => {
					// console.log(props)
					return <DrawContents />
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
		</NavigationContainer>
	)
}
