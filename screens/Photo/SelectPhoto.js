import React, { useState, useEffect } from "react"
import * as MediaLibrary from "expo-media-library"
import * as Permissions from "expo-permissions"
import styled from "styled-components"
import Loader from "../../components/Loader"
import { Image, TouchableOpacity, ScrollView } from "react-native"
import constants from "../../constants"
import styles from "../../styles"
import { useNavigation } from "@react-navigation/native"

const View = styled.View`
	flex: 1;
	/* flex-direction: row; */
`
const Button = styled.TouchableOpacity`
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
			console.log(selected)
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
									height: constants.height / 2
								}}
								source={{ uri: selected.uri }}
							/>
							<Button onPress={handleSelected}>
								<Text>Select Photo</Text>
							</Button>
							<ScrollView
								contentContainerStyle={{
									flexDirection: "row",
									flexWrap: "wrap"
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
														: 1
											}}
										/>
									</TouchableOpacity>
								))}
							</ScrollView>
						</>
					) : (
						"You canceled"
					)}
				</View>
			) : (
				"You don't have any photo"
			)}
		</View>
	)
}
