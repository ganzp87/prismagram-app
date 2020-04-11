import React from "react"
import { Image, Dimensions } from "react-native"
import ImageZoom from "react-native-image-pan-zoom"

export default ({ route }) => {
	const uri = route.params.url
	const width = Dimensions.get("window").width
	const height = Dimensions.get("window").height
	return (
		<ImageZoom
			cropWidth={width}
			cropHeight={height}
			imageWidth={width}
			imageHeight={width}
		>
			<Image
				style={{
					width: width,
					height: width,
				}}
				source={{ uri }}
				resizeMode="contain"
			/>
		</ImageZoom>
	)
}
