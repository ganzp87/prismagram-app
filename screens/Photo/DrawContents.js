import React, { useEffect } from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default (props) => {
	// console.log(props)
	const navigation = useNavigation()
	return (
		<View>
			<TouchableOpacity
				// style={{ flex: 1, width: 200, height: 100 }}
				onPress={() => navigation.navigate("AlbumList", { props })}
			>
				<Text>AlbumList</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate("SelectPhoto", { props })}
			>
				<Text>SelectPhoto</Text>
			</TouchableOpacity>
		</View>
	)
}
