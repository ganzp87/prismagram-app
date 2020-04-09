import React from "react"
import { View, Text, TouchableOpacity, ScrollView, Button } from "react-native"
import * as MediaLibrary from "expo-media-library"

export default (props) => {
	console.log(props)
	const openAlbum = async (title) => {
		const album = await MediaLibrary.getAlbumAsync(title)
		console.log(album)
	}
	return (
		<ScrollView>
			{props.params.albums.map((item) => (
				<View>
					<TouchableOpacity
						onPress={() => openAlbum(`${item.title}`)}
					>
						<Text>{item.title}</Text>
						<Text>사진 갯수 : {item.assetCount}</Text>
					</TouchableOpacity>
				</View>
			))}
		</ScrollView>
	)
}
