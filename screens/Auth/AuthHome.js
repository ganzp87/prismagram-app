import React from "react"
import styled from "styled-components"
import constants from "../../constants"
import AuthButton from "../../components/AuthButton"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`

const Image = styled.Image`
	width: ${Math.floor(constants.width / 2)};
	height: 100px;
	margin-bottom: 10px;
`

const Touchable = styled.TouchableOpacity``
const LoginLink = styled.View``
const LoginLinkText = styled.Text`
	color: ${(props) => props.theme.blueColor};
	margin-top: 20px;
`

export default ({ navigation }) => (
	<View>
		<Image
			resizeMode={"contain"}
			source={require("../../assets/logo.png")}
		/>
		<AuthButton
			text={"Create New Account"}
			onPress={() => navigation.navigate("SignUp")}
		/>
		<Touchable onPress={() => navigation.navigate("Login")}>
			<LoginLink>
				<LoginLinkText>Log in</LoginLinkText>
			</LoginLink>
		</Touchable>
	</View>
)
