import React, { useState, useEffect } from "react"
import styled from "styled-components"
import * as Permissions from "expo-permissions"
import { Camera } from "expo-camera"
import Loader from "../../components/Loader"
import constants from "../../constants"
import { TouchableOpacity, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../../styles"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

const Text = styled.Text``

export default ({ navigation }) => {
	const [loading, setLoading] = useState(true)
	const [hasPermission, setHasPermission] = useState(false)
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
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
				<Camera
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
			) : null}
		</View>
	)
}
