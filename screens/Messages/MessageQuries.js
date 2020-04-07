import gql from "graphql-tag"

export const SEEROOM = gql`
	query seeRoom($id: String!) {
		seeRoom(id: $id) {
			room {
				id
				participants {
					id
					username
				}
				createdAt
				updatedAt
			}
			messages {
				id
				to {
					id
					email
					username
					avatar
				}
				from {
					id
					email
					username
					isSelf
					avatar
				}
				text
				createdAt
			}
		}
	}
`

export const SEND_MESSAGE = gql`
	mutation sendMessage($roomId: String!, $text: String!) {
		sendMessage(roomId: $roomId, text: $text) {
			id
			to {
				id
				email
				username
				avatar
			}
			from {
				id
				email
				username
				isSelf
				avatar
			}
			text
			createdAt
		}
	}
`

export const NEW_MESSAGE = gql`
	subscription newMessage($roomId: String!, $email: String!) {
		newMessage(roomId: $roomId, email: $email) {
			id
			to {
				id
				email
				username
				avatar
			}
			from {
				id
				email
				username
				avatar
			}
			text
			createdAt
		}
	}
`
