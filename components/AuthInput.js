import React from "react"
import styled from "styled-components"
import constants from "../constants"
import PropTypes from "prop-types"

const Container = styled.View`
	margin-bottom: 10px;
`

const TextInput = styled.TextInput`
	width: ${constants.width / 1.7};
	padding: 5px;
	background-color: ${(props) => props.theme.greyColor};
	border: 1px solid ${(props) => props.theme.lightGreyColor};
	border-radius: 4px;
`

const AuthInput = ({
	placeholder,
	value,
	keyboardType = "default",
	autoCapitalize = "none",
	onChange,
	returnKeyType = "done",
	onSubmitEditing = () => null,
	autoCorrect = true
}) => (
	<Container>
		<TextInput
			onChangeText={onChange}
			placeholder={placeholder}
			value={value}
			keyboardType={keyboardType}
			autoCapitalize={autoCapitalize}
			returnKeyType={returnKeyType}
			onSubmitEditing={onSubmitEditing}
			autoCorrect={autoCorrect}
		/>
	</Container>
)

AuthInput.propTypes = {
	placeholder: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	keyboardType: PropTypes.oneOf([
		"default",
		"number-pad",
		"decimal-pad",
		"numeric",
		"email-address",
		"phone-pad"
	]),
	autoCapitalize: PropTypes.oneOf([
		"none",
		"characters",
		"sentences",
		"words"
	]),
	onChange: PropTypes.func.isRequired,
	returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
	onSubmitEditing: PropTypes.func.isRequired,
	autoCorrect: PropTypes.bool.isRequired
}

export default AuthInput
