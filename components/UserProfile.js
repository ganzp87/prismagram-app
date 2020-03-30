import React, { useState } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { Image, View, TouchableOpacity, Platform } from "react-native"
import styles from "../styles"
import { Ionicons } from "@expo/vector-icons"
import constants from "../constants"
import { SquarePhoto } from "./SquarePhoto"
import Post from "./Post"

const ProfileHeader = styled.View`
	padding: 20px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`
const HeaderColumn = styled.View``

const ProfileStats = styled.View`
	flex-direction: row;
`

const Stat = styled.View`
	align-items: center;
	margin-left: 20px;
`

const Bold = styled.Text`
	font-weight: bold;
`

const StatName = styled.Text`
	margin-top: 10px;
	font-size: 15px;
	color: ${styles.darkGreyColor};
`

const ProfileMeta = styled.View`
	align-items: flex-start;
	margin-top: 10px;
	margin-left: 20px;
`

const Bio = styled.Text`
	font-size: 15px;
`

const ButtonContainer = styled.View`
	flex-direction: row;
	margin-top: 30px;
`

const Button = styled.View`
	width: ${constants.width / 2};
	align-items: center;
`

const UserProfile = ({
	avatar,
	postsCount,
	followingCount,
	followersCount,
	bio,
	fullName,
	posts
}) => {
	const [isGrid, setIsGrid] = useState(true)
	const toggleGrid = () => {
		setIsGrid(!isGrid)
	}
	return (
		<View>
			<ProfileHeader>
				<Image
					style={{ height: 80, width: 80, borderRadius: 40 }}
					source={{ uri: avatar }}
				/>
				<HeaderColumn>
					<ProfileStats>
						<Stat>
							<Bold>{postsCount}</Bold>
							<StatName>Posts</StatName>
						</Stat>
						<Stat>
							<Bold>{followingCount}</Bold>
							<StatName>Followings</StatName>
						</Stat>
						<Stat>
							<Bold>{followersCount}</Bold>
							<StatName>Followers</StatName>
						</Stat>
					</ProfileStats>
				</HeaderColumn>
			</ProfileHeader>
			<ProfileMeta>
				<Bold>{fullName}</Bold>
				<Bio>{bio}</Bio>
			</ProfileMeta>
			<ButtonContainer>
				<TouchableOpacity onPress={toggleGrid}>
					<Button>
						<Ionicons
							color={
								isGrid
									? styles.blackColor
									: styles.darkGreyColor
							}
							size={32}
							name={
								Platform.OS === "ios" ? "ios-grid" : "md-grid"
							}
						/>
					</Button>
				</TouchableOpacity>
				<TouchableOpacity onPress={toggleGrid}>
					<Button>
						<Ionicons
							color={
								!isGrid
									? styles.blackColor
									: styles.darkGreyColor
							}
							size={32}
							name={
								Platform.OS === "ios" ? "ios-list" : "md-list"
							}
						/>
					</Button>
				</TouchableOpacity>
			</ButtonContainer>
			{posts &&
				posts.map((p) =>
					isGrid ? (
						<SquarePhoto key={p.id} {...p} />
					) : (
						<Post key={p.id} {...p} />
					)
				)}
		</View>
	)
}

UserProfile.propTypes = {
	id: PropTypes.string.isRequired,
	avatar: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	fullName: PropTypes.string.isRequired,
	isFollowing: PropTypes.bool.isRequired,
	isSelf: PropTypes.bool.isRequired,
	bio: PropTypes.string.isRequired,
	followingCount: PropTypes.number.isRequired,
	followersCount: PropTypes.number.isRequired,
	postsCount: PropTypes.number.isRequired,
	posts: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			user: PropTypes.shape({
				id: PropTypes.string.isRequired,
				avatar: PropTypes.string,
				username: PropTypes.string.isRequired
			}).isRequired,
			files: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.string.isRequired,
					url: PropTypes.string.isRequired
				})
			).isRequired,
			likeCount: PropTypes.number.isRequired,
			isLiked: PropTypes.bool.isRequired,
			comments: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.string.isRequired,
					text: PropTypes.string.isRequired,
					user: PropTypes.shape({
						id: PropTypes.string.isRequired,
						username: PropTypes.string.isRequired
					}).isRequired
				})
			).isRequired,
			caption: PropTypes.string.isRequired,
			location: PropTypes.string
			// createdAt: PropTypes.string.isRequired
		})
	)
}
export default UserProfile
