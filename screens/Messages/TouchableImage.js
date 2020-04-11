import React from "react"
import { TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default ({ url }) => {
	const navigation = useNavigation()
	const enlargeImage = () => {
		navigation.navigate("EnlargeImage", { url })
	}
	return (
		<TouchableOpacity onPress={enlargeImage}>
			<Image
				source={{
					uri: url,
				}}
				style={{
					alignSelf: "flex-end",
					width: 200,
					height: 200,
				}}
			/>
		</TouchableOpacity>
	)
}
