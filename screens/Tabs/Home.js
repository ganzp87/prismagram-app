import React, { useState, useContext } from "react"
import Loader from "../../components/Loader"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { ScrollView, RefreshControl, Alert } from "react-native"
import Post from "../../components/Post"
import { POST_FRAGMENT } from "../../fragments"
import { AuthContext } from "../../AuthContext"

export const FEED_QUERY = gql`
	{
		seeFeed {
			...PostParts
		}
	}
	${POST_FRAGMENT}
`
export default () => {
	const [refreshing, setRefreshing] = useState(false)
	const { loading, data, refetch } = useQuery(FEED_QUERY)
	const { isLoggedIn, logUserOut, userEmail: email } = useContext(AuthContext)
	if (!isLoggedIn) {
		Alert.alert("로그인이 풀렸습니다. 다시 로그인 해주세요.")
		logUserOut()
	}
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
