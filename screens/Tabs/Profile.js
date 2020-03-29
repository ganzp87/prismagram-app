import React, { useEffect } from "react"
import styled from "styled-components"
import Loader from "../../components/Loader"
import { gql } from "apollo-boost"
import { USER_FRAGMENT } from "../../fragments"
import { ScrollView } from "react-native"
import { useQuery } from "react-apollo-hooks"
import UserProfile from "../../components/UserProfile"

export const ME = gql`
	{
		seeMe {
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

export default (navigation) => {
	const { loading, data } = useQuery(ME)
	useEffect(() => {
		if (data.me) {
			navigation.setParams("title", data.me.username)
		}
	}, [data])
	console.log(loading, data)
	return (
		<ScrollView>
			{loading ? (
				<Loader />
			) : (
				data && data.me && <UserProfile {...data.me} />
			)}
		</ScrollView>
	)
}
