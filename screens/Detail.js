import React from "react"
import styled from "styled-components"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import { POST_FRAGMENT } from "../fragments"
import Loader from "../components/Loader"
import { ScrollView } from "react-native"
import Post from "../components/Post"

const POST_DETAIL = gql`
	query seeFullPost($id: String!) {
		seeFullPost(id: $id) {
			...PostParts
		}
	}
	${POST_FRAGMENT}
`

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: white;
`

const Text = styled.Text``

export default ({ navigation, route }) => {
	const { loading, data } = useQuery(POST_DETAIL, {
		variables: { id: route.params.id }
	})
	return (
		<ScrollView style={{ flex: 1 }}>
			{loading ? (
				<Loader />
			) : (
				data && data.seeFullPost && <Post {...data.seeFullPost} />
			)}
			{/* <Text>I should fetch for : {route.params.id}</Text> */}
		</ScrollView>
	)
}
