import { Notifications } from "expo"
import * as Permissions from "expo-permissions"
import Constants from "expo-constants"

export const askPushMessagePermission = async () => {
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
			// setStatus(finalStatus)
			let token = await Notifications.getExpoPushTokenAsync()
			// ExponentPushToken[sAj6CfOeifkdcTm6N9yTJf]
			// console.log(token)
			// Notifications.setBadgeNumberAsync(0)
			return [finalStatus, token]
		} else {
			console.log("Must use physical device for Push Notifications")
			// alert("Must use physical device for Push Notifications")
		}
	} catch (error) {
		console.log(error)
		throw Error(error)
	}
}
