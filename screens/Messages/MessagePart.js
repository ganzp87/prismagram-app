import React from "react"
import { View, Text, Image } from "react-native"

export default ({ from, text, id, email }) => {
	let isSelf
	if (from.email !== "" && from.email !== undefined) {
		isSelf = from.email === email
	}
	// console.log(
	// 	text,
	// 	from.username,
	// 	"isSelf :",
	// 	isSelf,
	// 	"받는사람 :",
	// 	from.email,
	// 	"본인 :",
	// 	email
	// )
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
						<Text>
							{text} : {from.username}
						</Text>
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
						<Text>
							{from.username} : {text}
						</Text>
					</View>
				)}
			</View>
		)
	)
}
