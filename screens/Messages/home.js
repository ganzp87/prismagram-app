import React, { useState, useEffect, Suspense } from "react"
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
} from "react-native"
import MessagePart from "./MessagePart"
import { SEEROOM, SEND_MESSAGE, NEW_MESSAGE } from "./MessageQuries"

export default () => {
	return (
		<View>
			<Text>hi</Text>
		</View>
	)
}
