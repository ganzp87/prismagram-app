import React from "react"
import styled from "styled-components"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import { USER_FRAGMENT } from "../fragments"
import Loader from "../components/Loader"
import { ScrollView } from "react-native"
import UserProfile from "../components/UserProfile"

const GET_USER = gql`
	query seeUser($username: String!) {
		seeUser(username: $username) {
			...UserParts
		}
	}
	${USER_FRAGMENT}
`

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: white;
`

const Text = styled.Text``

export default ({ navigation, route }) => {
	const { loading, data } = useQuery(GET_USER, {
		variables: { username: route.params.username }
	})
	return (
		<ScrollView style={{ flex: 1 }}>
			{loading ? (
				<Loader />
			) : (
				data && data.seeUser && <UserProfile {...data.seeUser} />
			)}
			{/* <Text>I should fetch for : {route.params.id}</Text> */}
		</ScrollView>
	)
}
