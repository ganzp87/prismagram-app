import React, { useState, useContext, Suspense } from "react"
import styled from "styled-components"
import gql from "graphql-tag"
import { useQuery } from "react-apollo-hooks"
import {
	ScrollView,
	RefreshControl,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native"
import Loader from "../../components/Loader"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../AuthContext"

const SEEROOMS = gql`
	query seeRooms {
		seeRooms {
			participants {
				id
				email
				username
			}
			id
			createdAt
			updatedAt
		}
	}
`

const View = styled.View`
	justify-content: center;
	align-items: center;
	background-color: white;
`

const SuspendView = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: white;
`

const Text = styled.Text``

export default () => {
	const { isLoggedIn, logUserOut, userEmail: email } = useContext(AuthContext)
	if (!isLoggedIn) {
		console.log("로그인이 풀렸습니다. 다시 로그인 해주세요.")
		logUserOut()
	}
	// console.log(isLoggedIn)
	const [refreshing, setRefreshing] = useState(false)
	const { loading, data, refetch } = useQuery(SEEROOMS, {
		// fetchPolicy: "network-only",
		// partialRefetch: true,
		suspend: true,
	})
	// console.log(data)
	const navigation = useNavigation()
	const refresh = async () => {
		try {
			setRefreshing(true)
			await refetch()
			console.log(loading, data)
		} catch (error) {
			console.log(1111)
			console.log(error)
		} finally {
			setRefreshing(false)
		}
	}
	// console.log("email", email)
	return (
		<Suspense
			fallback={
				<SuspendView
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator />
				</SuspendView>
			}
		>
			<ScrollView
				contentContainerStyle={{
					// flex: 1,
					// justifyContent: "flex-end",
					alignItems: "center",
					justifyContent: "center",
					// paddingVertical: 0
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
					/>
				}
			>
				{loading ? (
					<Loader />
				) : (
					data &&
					data.seeRooms &&
					data.seeRooms.map((room) => {
						return (
							<TouchableOpacity
								style={{ padding: 10, alignItems: "center" }}
								onPress={() =>
									navigation.navigate("Message", {
										roomId: room.id,
										email: email !== undefined ? email : "",
									})
								}
							>
								<Text key={room.participants[0].id}>
									상대방 :{" "}
									{room.participants[0].email === email
										? room.participants[1].username
										: room.participants[0].username}
								</Text>
								<View key={room.id}>
									<Text key={room.id}>
										채팅방 ID : {room.id}
									</Text>
									<Text key={room.id + 1}>
										최종 수신일 : {room.updatedAt}
									</Text>
								</View>
							</TouchableOpacity>
						)
					})
				)}
			</ScrollView>
		</Suspense>
	)
}
