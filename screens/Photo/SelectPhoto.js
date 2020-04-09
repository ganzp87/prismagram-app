import React, { useState, useEffect } from "react"
import * as MediaLibrary from "expo-media-library"
import * as Permissions from "expo-permissions"
import styled from "styled-components"
import Loader from "../../components/Loader"
import { Image, TouchableOpacity, ScrollView, Button } from "react-native"
import constants from "../../constants"
import styles from "../../styles"
import { useNavigation } from "@react-navigation/native"
import { useIsDrawerOpen } from "@react-navigation/drawer"

const View = styled.View`
	flex: 1;
	/* flex-direction: row; */
`
const RightButton = styled.TouchableOpacity`
	width: 100px;
	height: 30px;
	position: absolute;
	right: 5px;
	top: 15px;
	background-color: ${styles.blueColor};
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`

const LeftButton = styled.TouchableOpacity`
	width: 100px;
	height: 30px;
	position: absolute;
	left: 5px;
	top: 15px;
	background-color: ${styles.blueColor};
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`

const Text = styled.Text`
	color: white;
	font-weight: 600;
`

export default ({ route }) => {
	const [loading, setLoading] = useState(true)
	const [hasPermission, setHasPermission] = useState(false)
	const [selected, setSelected] = useState()
	const [allPhotos, setAllPhotos] = useState()
	const navigation = useNavigation()

	const changeSelected = (photo) => {
		setSelected(photo)
	}
	const getPhotos = async () => {
		try {
			const { assets } = await MediaLibrary.getAssetsAsync()
			const [firstPhoto] = assets
			setSelected(firstPhoto)
			setAllPhotos(assets)
			// console.log(selected)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}
	const askPermission = async () => {
		try {
			const { status } = await Permissions.askAsync(
				Permissions.CAMERA_ROLL
			)
			if (status === "granted") {
				setHasPermission(true)
				getPhotos()
			}
			// console.log(permission)
		} catch (error) {
			console.log(e)
			setHasPermission(false)
		}
	}
	const handleSelected = () => {
		navigation.navigate("UploadPhoto", { photo: selected })
	}
	const goAlbumList = async () => {
		const album = await MediaLibrary.getAlbumsAsync()
		// console.log(album)
		navigation.navigate("AlbumDrawNavigation", {
			album: album,
		})
	}
	useEffect(() => {
		askPermission()
	}, [])

	return (
		<View>
			{loading ? (
				<Loader />
			) : selected ? (
				<View>
					{hasPermission ? (
						<>
							<Image
								key={selected.id}
								style={{
									width: constants.width,
									height: constants.height / 2,
								}}
								source={{ uri: selected.uri }}
							/>
							<RightButton onPress={handleSelected}>
								<Text>Select Photo</Text>
							</RightButton>
							<LeftButton
								onPress={() => navigation.toggleDrawer()}
								title="Toggle Drawer"
							>
								<Text>Album List</Text>
							</LeftButton>
							<ScrollView
								contentContainerStyle={{
									flexDirection: "row",
									flexWrap: "wrap",
								}}
							>
								{allPhotos.map((photo) => (
									<TouchableOpacity
										key={photo.id}
										onPress={() => changeSelected(photo)}
									>
										<Image
											key={photo.id}
											source={{ uri: photo.uri }}
											style={{
												width: constants.width / 3,
												height: constants.height / 6,
												opacity:
													photo.id === selected.id
														? 0.5
														: 1,
											}}
										/>
									</TouchableOpacity>
								))}
							</ScrollView>
						</>
					) : (
						<Text>"Your permission canceled"</Text>
					)}
				</View>
			) : (
				<Text>"You don't have any photo"</Text>
			)}
		</View>
	)
}
