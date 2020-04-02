import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import * as Permissions from "expo-permissions"
import * as MediaLibrary from "expo-media-library"
import { Camera } from "expo-camera"
import Loader from "../../components/Loader"
import constants from "../../constants"
import { TouchableOpacity, Platform, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../../styles"
import { useNavigation } from "@react-navigation/native"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

const Text = styled.Text``

const Button = styled.View`
	width: 80;
	height: 80;
	border-radius: 40px;
	border: 10px solid ${styles.lightGreyColor};
`

export default () => {
	const cameraRef = useRef()
	const [canTakePhoto, setCanTakePhoto] = useState(true)
	const [loading, setLoading] = useState(true)
	const [hasPermission, setHasPermission] = useState(false)
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
	const navigation = useNavigation()
	const takePhoto = async () => {
		if (!canTakePhoto) {
			return
		}
		try {
			setCanTakePhoto(false)
			const { uri } = await cameraRef.current.takePictureAsync({
				quality: 1
				// exif: true
			})
			const assets = await MediaLibrary.createAssetAsync(uri)
			navigation.navigate("UploadPhoto", { photo: assets })
			setCanTakePhoto(true)
		} catch (error) {
			console.log(error)
			setCanTakePhoto(true)
		}
	}
	const toggleType = () => {
		if (cameraType === Camera.Constants.Type.back) {
			setCameraType(Camera.Constants.Type.front)
		} else {
			setCameraType(Camera.Constants.Type.back)
		}
	}
	const askPermission = async () => {
		try {
			const { status } = await Permissions.askAsync(Permissions.CAMERA)
			if (status === "granted") {
				setHasPermission(true)
			}
			// console.log(permission)
		} catch (error) {
			console.log(error)
			setHasPermission(false)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		askPermission()
	}, [])
	return (
		<View>
			{loading ? (
				<Loader />
			) : hasPermission ? (
				<>
					<Camera
						ref={cameraRef}
						type={cameraType}
						style={{
							justifyContent: "flex-end",
							padding: 20,
							width: constants.width,
							height: constants.height / 1.4
						}}
					>
						<TouchableOpacity onPress={toggleType}>
							<Ionicons
								name={
									Platform.OS === "ios"
										? "ios-reverse-camera"
										: "md-reverse-camera"
								}
								size={28}
								color={styles.blackColor}
							/>
						</TouchableOpacity>
					</Camera>
					<View>
						<TouchableOpacity
							onPress={takePhoto}
							disabled={!canTakePhoto}
						>
							<Button />
						</TouchableOpacity>
					</View>
				</>
			) : null}
		</View>
	)
}
