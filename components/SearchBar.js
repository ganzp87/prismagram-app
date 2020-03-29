import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { TextInput } from "react-native"
import constants from "../constants"
import styles from "../styles"

const SearchBar = ({ value, onSubmit, onChangeText }) => (
	<TextInput
		style={{
			width: constants.width - 100,
			height: 35,
			backgroundColor: "#e6e3e3",
			padding: 10,
			borderRadius: 5,
			textAlign: "center"
		}}
		returnKeyType="search"
		value={value}
		placeholder="Search"
		onEndEditing={onSubmit}
		onChangeText={onChangeText}
	/>
)

SearchBar.propTypes = {
	value: PropTypes.string.isRequired,
	onEndEditing: PropTypes.func.isRequired,
	onChangeText: PropTypes.func.isRequired
}

export default SearchBar
