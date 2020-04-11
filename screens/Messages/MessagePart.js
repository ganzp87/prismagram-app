import React from "react"
import { View, Text, Image } from "react-native"
import TouchableImage from "./TouchableImage"

export default ({ from, text, id, email, file = null }) => {
	let isSelf
	let url
	if (from.email !== "" && from.email !== undefined) {
		isSelf = from.email === email
	}
	// console.log(file)
	if (file !== null) {
		url = file.url
	} else {
		url = ""
	}
	return (
		isSelf !== undefined && (
			<View
				style={{
					display: "flex",
					width: "100%",
					flexDirection: "column",
					alignContent: "flex-end",
					alignItems: isSelf ? "flex-end" : "flex-start",
					padding: 10,
				}}
			>
				{isSelf ? (
					<View>
						<Image
							style={{
								alignSelf: "flex-end",
								height: 40,
								width: 40,
								borderRadius: 20,
							}}
							source={{
								uri:
									from.avatar !== undefined
										? from.avatar
										: "",
							}}
						/>
						{url !== "" ? (
							<View style={{ flexDirection: "row" }}>
								<Text>{from.username}</Text>
								<TouchableImage {...file} />
							</View>
						) : (
							<Text>
								{text} : {from.username}
							</Text>
						)}
					</View>
				) : (
					<View>
						<Image
							style={{
								alignSelf: "flex-start",
								height: 40,
								width: 40,
								borderRadius: 20,
							}}
							source={{
								uri:
									from.avatar !== undefined
										? from.avatar
										: "",
							}}
						/>
						{url !== "" ? (
							<View style={{ flexDirection: "row" }}>
								<Text>{from.username}</Text>
								<TouchableImage {...file} />
							</View>
						) : (
							<Text>
								{from.username} : {text}
							</Text>
						)}
					</View>
				)}
			</View>
		)
	)
}
