import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { TouchableOpacity, Image } from "react-native"
import constants from "../constants"
import { withNavigation } from "@react-navigation/compat"
import { useNavigation } from "@react-navigation/native"

export const SquarePhoto = ({ files = [], id }) => {
	const navigation = useNavigation()
	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("TabNavigation", {
					screen: "Search",
					params: { screen: "Detail", params: { id } }
				})
			}
		>
			<Image
				key={id}
				source={{ uri: files[0].url }}
				style={{
					width: constants.width / 3,
					height: constants.height / 6
				}}
			/>
		</TouchableOpacity>
	)
}
