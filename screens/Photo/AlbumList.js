import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Button } from "react-native"
import * as MediaLibrary from "expo-media-library"
import Loader from "../../components/Loader"
import { useNavigation } from "@react-navigation/native"

export default (props) => {
	const [albumList, setAlbumList] = useState()
	const [loading, setLoading] = useState(true)
	const [selected, setSelected] = useState()
	const [allPhotos, setAllPhotos] = useState()
	// console.log(props)
	const navigation = useNavigation()

	function mapAsync(array, callbackfn) {
		return Promise.all(array.map(callbackfn))
	}

	async function filterAsync(array, callbackfn) {
		const filterMap = await mapAsync(array, callbackfn)
		return array.filter((value, index) => filterMap[index])
	}
	const cbFilter = async (album) => {
		if (album.id !== null && album.title !== null) {
			const { assets } = await MediaLibrary.getAssetsAsync({
				first: 10,
				album,
				mediaType: MediaLibrary.MediaType.photo,
			})
			return assets.length > 0
		}
	}

	const getAlbumList = async () => {
		const list = await MediaLibrary.getAlbumsAsync({})
		const filteredList = await filterAsync(list, cbFilter)
		setAlbumList(filteredList)
	}

	const openAlbum = async (title) => {
		try {
			const album = await MediaLibrary.getAlbumAsync(title)
			navigation.navigate("SelectPhoto", {
				album,
				room: props.route.params.props.room,
				myEmail: props.route.params.props.myEmail,
			})
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		getAlbumList()
	}, [])
	return (
		<ScrollView>
			{albumList ? (
				albumList.map((item) => (
					<View>
						<TouchableOpacity
							onPress={() => openAlbum(`${item.title}`)}
						>
							<Text>앨범 이름 : {item.title}</Text>
							<Text>사진 갯수 : {item.assetCount}</Text>
						</TouchableOpacity>
					</View>
				))
			) : (
				<Loader />
			)}
		</ScrollView>
	)
}
