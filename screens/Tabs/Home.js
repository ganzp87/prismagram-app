import React, { useState } from "react"
import styled from "styled-components"
import Loader from "../../components/Loader"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { ScrollView, RefreshControl } from "react-native"
import Post from "../../components/Post"
import { POST_FRAGMENT } from "../../fragments"

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: white;
`

const FEED_QUERY = gql`
	{
		seeFeed {
			...PostParts
		}
	}
	${POST_FRAGMENT}
`
export default ({ params, routes }) => {
	const [refreshing, setRefreshing] = useState(false)
	const { loading, data, refetch } = useQuery(FEED_QUERY)
	const refresh = async () => {
		try {
			setRefreshing(true)
			await refetch()
		} catch (error) {
			console.log(error)
		} finally {
			setRefreshing(false)
		}
	}
	// console.log(loading, data)
	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={refresh} />
			}
		>
			{loading ? (
				<Loader />
			) : (
				data &&
				data.seeFeed &&
				data.seeFeed.map((post) => <Post key={post.id} {...post} />)
			)}
		</ScrollView>
	)
}
