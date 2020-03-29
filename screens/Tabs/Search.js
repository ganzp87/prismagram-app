import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Loader from "../../components/Loader"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import { TouchableOpacity } from "react-native"
import { ScrollView, RefreshControl } from "react-native"
import { SquarePhoto } from "../../components/SquarePhoto"
import { useNavigation } from "@react-navigation/native"

export const SEARCH = gql`
	query searchPost($term: String!) {
		searchPost(term: $term) {
			id
			files {
				id
				url
			}
			likeCount
			comments {
				id
				user {
					id
					username
					avatar
				}
				text
			}
		}
	}
`

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: white;
`

const Text = styled.Text``

export default ({ route }) => {
	const { params } = route
	let term = ""
	let shouldFetch = false
	if (params !== undefined) {
		term = params.text
		shouldFetch = true
	}
	const navigation = useNavigation()
	const [refreshing, setRefreshing] = useState(false)
	const { data, loading, refetch } = useQuery(SEARCH, {
		variables: {
			term
		},
		skip: !shouldFetch,
		fetchPolicy: "network-only"
	})
	const refresh = async () => {
		try {
			setRefreshing(true)
			await refetch({ variables: { term } })
		} catch (error) {
		} finally {
			setRefreshing(false)
		}
	}
	// console.log(data, loading)

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshin={refreshing} onRefresh={refresh} />
			}
		>
			{loading ? (
				<Loader />
			) : (
				data &&
				data.searchPost &&
				data.searchPost.map((post) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Detail", {
								id: post.id
							})
						}
					>
						<SquarePhoto key={post.key} {...post} />
					</TouchableOpacity>
				))
			)}
		</ScrollView>
	)
}
