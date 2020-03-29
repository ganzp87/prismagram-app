import { gql } from "apollo-boost"

export const POST_FRAGMENT = gql`
	fragment PostParts on Post {
		id
		location
		caption
		user {
			id
			avatar
			username
		}
		files {
			id
			url
		}
		likeCount
		isLiked
		comments {
			id
			text
			user {
				id
				username
			}
		}
	}
`

export const USER_FRAGMENT = gql`
	fragment UserParts on User {
		id
		avatar
		username
		email
		firstName
		lastName
		fullName
		isFollowing
		isSelf
		bio
		# following {
		# 	id
		# 	username
		# }
		# followers {
		# 	id
		# 	username
		# }
		posts {
			...PostParts
		}
		# likes {
		# 	id
		# }
		# comments {
		# 	text
		# }
	}
	${POST_FRAGMENT}
`
