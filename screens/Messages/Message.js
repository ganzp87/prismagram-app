import React, {
	useState,
	useEffect,
	Suspense,
	useRef,
	useImperativeHandle,
} from "react"
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks"
import Loader from "../../components/Loader"
import {
	ScrollView,
	RefreshControl,
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	TouchableOpacity,
} from "react-native"
import MessagePart from "./MessagePart"
import { SEEROOM, SEND_MESSAGE, NEW_MESSAGE } from "./MessageQuries"
import { Notifications } from "expo"
import * as Permissions from "expo-permissions"
import Constants from "expo-constants"
import NavIcon from "../../components/NavIcon"
import { useNavigation } from "@react-navigation/native"

export default ({ route }) => {
	const messageList = []
	const roomId = route.params.roomId
	const myInfo = {
		email: route.params.email,
	}
	const scrollViewRef = useRef(null)
	const [refreshing, setRefreshing] = useState(false)
	const [message, setMessage] = useState()
	const navigation = useNavigation()

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

	// const refresh = async () => {
	// 	try {
	// 		setRefreshing(true)
	// 		const a = await refetch()
	// 		setMessages(a.data.seeRoom.messages)
	// 	} catch (error) {
	// 		console.log(error)
	// 	} finally {
	// 		setRefreshing(false)
	// 	}
	// }

	const screenHeight = Dimensions.get("window").height
	// console.log(screenHeight)

	const [notificationStatus, setStatus] = useState(false)
	const askPushMessagePermission = async () => {
		try {
			if (Constants.isDevice) {
				const { status: existingStatus } = await Permissions.getAsync(
					Permissions.NOTIFICATIONS
				)
				let finalStatus = existingStatus
				if (existingStatus !== "granted") {
					const { status } = await Permissions.askAsync(
						Permissions.NOTIFICATIONS
					)
					finalStatus = status
				}
				console.log(finalStatus)
				setStatus(finalStatus)
				let token = await Notifications.getExpoPushTokenAsync()
				// ExponentPushToken[sAj6CfOeifkdcTm6N9yTJf]
				console.log(token)
				// Notifications.setBadgeNumberAsync(0)
			} else {
				console.log("Must use physical device for Push Notifications")
				// alert("Must use physical device for Push Notifications")
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		askPushMessagePermission()
	}, [])
	if (messages) {
		messages.sort(
			(a, b) =>
				Date.parse(new Date(b.createdAt)) - Date.parse(a.createdAt)
		)
	}
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
						// paddingVertical: 50,
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
								// height: "auto",
								// maxHeight: screenHeight - 200,
								alignContent: "flex-end",
								// justifyContent: "flex-end",
								// paddingVertical: 50,
								// alignItems: "center",
								borderWidth: 1,
								borderColor: "black",
								// paddingRight: -20,
							}}
							data={messages}
							renderItem={({ item }) => {
								return <MessagePart {...item} {...myInfo} />
							}}
							// ref={scrollViewRef}
							// onContentSizeChange={(w, h) => {
							// 	console.log(h)
							// 	scrollViewRef.current.scrollToEnd({
							// 		animated: true,
							// 	})
							// }}
							scrollTo
							showsVerticalScrollIndicator={false}
							// refreshControl={
							// 	<RefreshControl
							// 		refreshing={refreshing}
							// 		onRefresh={refresh}
							// 	/>
							// }
							inverted
						></FlatList>
						{/* <ScrollView
							contentContainerStyle={{
								// height: "auto",
								// maxHeight: screenHeight - 200,
								alignContent: "flex-end",
								justifyContent: "flex-end",
								// paddingVertical: 50,
								alignItems: "center",
								borderWidth: 1,
								borderColor: "black",
								paddingRight: -20,
							}}
							ref={scrollViewRef}
							onContentSizeChange={(w, h) => {
								// console.log(h)
								scrollViewRef.current.scrollToEnd({
									animated: true,
								})
							}}
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={refresh}
								/>
							}
						>
							{messages &&
								messages.map((message) => {
									if (!messageList.includes(message)) {
										messageList.push(message)
										return (
											<MessagePart
												{...message}
												{...myInfo}
											/>
										)
									}
									return
								})}
						</ScrollView> */}
						<View style={{ flexDirection: "row", paddingTop: 5 }}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("MessageNavigation", {
										screen: "AlbumDrawNavigation",
									})
								}
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
