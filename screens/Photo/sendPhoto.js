import React, { useState } from "react"
import { Image, ActivityIndicator, Alert } from "react-native"
import axios from "axios"
import styled from "styled-components"
import useInput from "../../hooks/useInput"
import styles from "../../styles"
import constants from "../../constants"
import AuthButton from "../../components/AuthButton"
import { gql } from "apollo-boost"
import { useMutation } from "react-apollo-hooks"
import { useNavigation } from "@react-navigation/native"

const View = styled.View`
	flex: 1;
`
const Container = styled.View`
	padding: 20px;
	flex-direction: row;
`

const Form = styled.View`
	justify-content: flex-start;
`

const STextInput = styled.TextInput`
	margin-bottom: 10px;
	border: 0px solid ${styles.lightGreyColor};
	border-bottom-width: 1px;
	padding-bottom: 10px;
	width: ${constants.width - 180};
`

const Button = styled.TouchableOpacity`
	background-color: ${(props) => props.theme.blueColor};
	padding: 10px;
	border-radius: 4px;
	align-items: center;
	justify-content: center;
`

const Text = styled.Text`
	color: white;
	font-weight: 600;
`
export default (props, photo) => {
	const [loading, setIsLoading] = useState(false)
	const toId =
		props.participants[0].email === props.myEmail
			? props.participants[0].id
			: props.participants[1].id
	console.log(toId)
	const [uploadMutation] = useMutation(SEND_IMG)
	const handleSubmit = async () => {
		const formData = new FormData()
		const name = photo.filename
		const [, type] = name.split(".")
		formData.append("file", {
			name,
			type: "image/jpeg",
			uri: photo.uri,
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
			// console.log(location)

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
	return (
		<View>
			<Container>
				<Image
					source={{ uri: photo.uri }}
					style={{ height: 80, width: 80, marginRight: 30 }}
				/>
				<Form>
					<STextInput
						onChangeText={captionInput.onChange}
						value={captionInput.value}
						placeholder="Caption"
						multiline={true}
						placeholderTextColor={styles.darkGreyColor}
					/>
					<STextInput
						onChangeText={locationInput.onChange}
						value={locationInput.value}
						placeholder="Location"
						multiline={true}
						placeholderTextColor={styles.darkGreyColor}
					/>
					<Button onPress={handleSubmit}>
						{loading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text>Upload </Text>
						)}
					</Button>
				</Form>
			</Container>
		</View>
	)
}
