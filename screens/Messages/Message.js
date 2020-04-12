import React, { useState, useEffect, Suspense, useRef } from "react"
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks"
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
	Dimensions,
	FlatList,
	TouchableOpacity,
} from "react-native"
import MessagePart from "./MessagePart"
import { SEEROOM, SEND_MESSAGE, NEW_MESSAGE } from "./MessageQuries"
import NavIcon from "../../components/NavIcon"
import { useNavigation } from "@react-navigation/native"

export default ({ route }) => {
	const roomId = route.params.roomId
	const myInfo = {
		email: route.params.email,
	}
	const [message, setMessage] = useState()
	const navigation = useNavigation()
	const [toUser, setYoUser] = useState()

	const { data: { seeRoom: oldRoom = [] } = [], error, refetch } = useQuery(
		SEEROOM,
		{
			variables: {
				id: roomId,
			},
			fetchPolicy: "cache-and-network",
			// suspend: true,
			// pollInterval: 50,
			// skip: false,
			// returnPartialData: true,
		}
	)
	const checkToUser = () => {
		if (oldRoom !== []) {
			const toUser = oldRoom.room.participants.filter(
				(user) => user.email !== myInfo.email
			)
			// console.log(toUser[0].id)
			setYoUser(toUser)
		}
	}

	const [messages, setMessages] = useState(oldRoom.messages || [])
	const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
		refetchQueries: refetch,
		update(cache, { data }) {
			const { seeRoom } = cache.readQuery({
				query: SEEROOM,
				variables: { id: roomId },
			})
			cache.writeQuery({
				query: SEEROOM,
				variables: {
					id: roomId,
				},
				data: {
					seeRoom: {
						__typename: "SeeRoomResponse",
						messages: [...seeRoom.messages, data.sendMessage],
						room: seeRoom.room,
					},
				},
			}),
				setMessages((previous) => [...previous, data.sendMessage])
		},
	})
	const { data, loading } = useSubscription(NEW_MESSAGE, {
		variables: {
			roomId,
			email: myInfo.email,
		},
		refetchQueries: refetch,
		onSubscriptionData: ({ subscriptionData: { data }, client }) => {
			if (!data) return null

			client.cache.writeQuery({
				query: SEEROOM,
				variables: { id: roomId },
				data: {
					seeRoom: {
						__typename: "SeeRoomResponse",
						messages: [...messages, data.newMessage],
						room: oldRoom.room,
					},
				},
			})
			setMessages((previous) => [...previous, data.newMessage])
		},
	})
	const handleNewMessage = (data) => {
		if (data !== undefined) {
			console.log("New Message Come Up to ->", myInfo.email)
			// console.log(data)
			const { newMessage } = data
			setMessages((previous) => [...previous, newMessage])
		}
	}
	useEffect(() => {
		setMessages(oldRoom.messages)
	}, [oldRoom.messages])
	useEffect(() => {
		checkToUser()
		handleNewMessage(data)
	}, [data])
	const onSubmit = async () => {
		if (message === "") {
			return
		}
		try {
			await sendMessageMutation({
				variables: {
					roomId,
					text: message,
					toId: toUser[0].id,
				},
			})
			setMessage("")
		} catch (error) {
			console.log(error)
		}
	}
	const onChangeText = (text) => {
		setMessage(text)
	}

	const screenHeight = Dimensions.get("window").height

	if (messages) {
		messages.sort(
			(a, b) =>
				Date.parse(new Date(b.createdAt)) - Date.parse(a.createdAt)
		)
	}
	useEffect(() => {
		refetch()
	}, [route])
	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={screenHeight - 700}
			style={{ flex: 1 }}
			enabled
			behavior="posision"
		>
			<Suspense
				fallback={
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ActivityIndicator />
					</View>
				}
			>
				<View
					style={{
						padding: 10,
						flex: 1,
						width: "100%",
						justifyContent: "space-between",
						alignItems: "stretch",
					}}
				>
					<View
						style={{
							alignItems: "center",
							padding: 10,
							backgroundColor: "white",
							borderRadius: 10,
							borderWidth: 1,
							borderColor: "black",
						}}
					>
						<View>
							{oldRoom.room && oldRoom.room.participants && (
								<Text key={oldRoom.room.participants[0].id}>
									대화 참여자 :{" "}
									{oldRoom.room.participants[0].username},{" "}
									{oldRoom.room.participants[1].username}
								</Text>
							)}
						</View>
					</View>

					<View style={{ flex: 1 }}>
						<FlatList
							style={{
								alignContent: "flex-end",

								borderWidth: 1,
								borderColor: "black",
							}}
							data={messages}
							renderItem={({ item }) => {
								return <MessagePart {...item} {...myInfo} />
								// console.log(item.text, item.file)
							}}
							scrollTo
							showsVerticalScrollIndicator={false}
							inverted
						></FlatList>

						<View style={{ flexDirection: "row", paddingTop: 5 }}>
							<TouchableOpacity
								onPress={async () => {
									return navigation.navigate(
										"MessageNavigation",
										{
											screen: "AlbumDrawNavigation",
											params: {
												screen: "SelectPhoto",
												params: {
													room: oldRoom.room,
													myEmail: route.params.email,
												},
											},
										}
									)
								}}
							>
								<NavIcon
									size={50}
									name={
										Platform.OS === "ios"
											? "ios-camera"
											: "md-camera"
									}
								/>
							</TouchableOpacity>
							<TextInput
								placeholder="Type a message"
								style={{
									alignItems: "flex-end",
									// marginTop: 50,
									width: "100%",
									backgroundColor: "white",
									borderRadius: 10,
									paddingVertical: 10,
									marginBottom: 0,
									marginLeft: 10,
									paddingLeft: 10,
								}}
								returnKeyType="send"
								value={message}
								onChangeText={onChangeText}
								onSubmitEditing={onSubmit}
							/>
						</View>
					</View>
				</View>
			</Suspense>
		</KeyboardAvoidingView>
	)
}
