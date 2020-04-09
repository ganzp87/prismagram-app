import React from "react"
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer"
import { View, Text, TouchableOpacity, ScrollView, Button } from "react-native"
import * as MediaLibrary from "expo-media-library"

export default (props) => {
	// const props = route.params?.album
	// console.log(route)
	console.log(props)
	// const albums = props.route.params.album
	// console.log(albums)
	const openAlbum = async (title) => {
		const album = await MediaLibrary.getAlbumAsync(title)
		console.log(album)
	}
	return (
		<ScrollView>
			{albums.map((item) => (
				<View>
					<TouchableOpacity
						onPress={() => openAlbum(`${item.title}`)}
						// onPress={() => navigation.toggleDrawer()}
						// title="Toggle Drawer"
					>
						<Text>{item.title}</Text>
						<Text>사진 갯수 : {item.assetCount}</Text>
					</TouchableOpacity>
				</View>
			))}
		</ScrollView>
		// <View>
		// 	<Text>This is the Home screen!</Text>
		// 	<Button
		// 		onPress={() => props.navigation.toggleDrawer()}
		// 		title="Toggle Drawer"
		// 	/>
		// </View>
	)
}
