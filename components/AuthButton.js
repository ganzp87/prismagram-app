import React from "react"
import styled from "styled-components"
import constants from "../constants"
import PropTypes from "prop-types"
import { ActivityIndicator } from "react-native"

const Touchable = styled.TouchableOpacity``
const Container = styled.View`
	background-color: ${(props) =>
		props.bgColor ? props.bgColor : props.theme.blueColor};
	padding: 10px 20px;
	margin: 0px 50px;
	width: ${constants.width / 1.7};
	border-radius: 4px;
`
const Text = styled.Text`
	color: white;
	text-align: center;
	font-weight: 600;
`

const AuthButton = ({ text, onPress, loading = false, bgColor = null }) => (
	<Touchable onPress={onPress} disabled={loading}>
		<Container bgColor={bgColor}>
			{loading ? (
				<ActivityIndicator color={"white"} />
			) : (
				<Text>{text}</Text>
			)}
		</Container>
	</Touchable>
)

AuthButton.prototypes = {
	text: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
}

export default AuthButton
