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
import ImageZoom from "react-native-image-pan-zoom"
import sendPhoto from "./sendPhoto"
import { useMutation } from "react-apollo-hooks"
import { SEND_IMG } from "../Messages/MessageQuries"

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

export default ({ navigation, route }) => {
	const [loading, setLoading] = useState(true)
	const [hasPermission, setHasPermission] = useState(false)
	const [selected, setSelected] = useState()
	const [allPhotos, setAllPhotos] = useState()
	const [toId, setToId] = useState()
	console.log(route)
	const updateToId = () => {
		const toId =
			route.params.room.participants[0].email ===
			route.params.room.myEmail
				? route.params.room.participants[1].id
				: route.params.room.participants[0].id
		setToId(toId)
	}
	const [uploadMutation] = useMutation(SEND_IMG)
	const changeSelected = (photo) => {
		setSelected(photo)
	}
	const getPhotos = async () => {
		try {
			const album = route.params.album
			const { assets } = await MediaLibrary.getAssetsAsync({
				first: 500,
				album,
				mediaType: MediaLibrary.MediaType.photo,
			})
			if (assets) {
				setSelected()
				setAllPhotos()
			}
			const [firstPhoto] = assets
			setSelected(firstPhoto)
			setAllPhotos(assets)
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

	const handleSubmit = async () => {
		const formData = new FormData()
		const name = photo.filename
		const [, type] = name.split(".")
		formData.append("file", {
			name,
			type: "image/jpeg",
			uri: selected.uri,
		})
		try {
			setIsLoading(true)
			const {
				data: { location },
			} = await axios.post(
				"http://192.168.0.3:4000/api/upload",
				formData,
				{
					header: {
						"content-type": "multipart/form-data",
					},
				}
			)
			console.log(location)

			const {
				data: { upload },
			} = await uploadMutation({
				variables: {
					roomId: route.room.id,
					toId,
					file: location,
				},
			})
			// console.log(upload)
			if (upload.id) {
				navigation.navigate("TabNavigation")
			}
		} catch (error) {
			console.log(error)
			Alert.alert("Can't upload", "Try later")
			setIsLoading(false)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		updateToId()
	}, [route.params.participants])
	useEffect(() => {
		askPermission()
	}, [navigation])

	return (
		<View>
			{loading ? (
				<Loader />
			) : selected ? (
				<View>
					{hasPermission ? (
						<>
							<ImageZoom
								cropWidth={constants.width}
								cropHeight={constants.width}
								imageWidth={constants.width}
								imageHeight={constants.width}
							>
								<Image
									key={selected.id}
									style={{
										width: constants.width,
										height: constants.height / 2,
									}}
									source={{ uri: selected.uri }}
								/>
							</ImageZoom>
							<RightButton onPress={handleSubmit}>
								<Text>Send Photo</Text>
							</RightButton>
							<LeftButton
								onPress={navigation.toggleDrawer}
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
								{allPhotos &&
									allPhotos.map((photo) => (
										<TouchableOpacity
											key={photo.id}
											onPress={() =>
												changeSelected(photo)
											}
										>
											<Image
												key={photo.id}
												source={{ uri: photo.uri }}
												style={{
													width: constants.width / 3,
													height:
														constants.height / 6,
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
