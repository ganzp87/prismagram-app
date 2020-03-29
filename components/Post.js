import React, { useState } from "react"
import { Image, Platform } from "react-native"
import styled from "styled-components"
import PropTypes from "prop-types"
import Swiper from "react-native-swiper"
import constants from "../constants"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles"
import { gql } from "apollo-boost"
import { useMutation } from "react-apollo-hooks"

export const TOGGLE_LIKE = gql`
	mutation toggleLike($postId: String!) {
		toggleLike(postId: $postId)
	}
`

const Container = styled.View``
const Header = styled.View`
	padding: 15px;
	flex-direction: row;
	align-items: center;
`
const Touchable = styled.TouchableOpacity``
const HeaderUserContainer = styled.View`
	margin-left: 10px;
`
const Bold = styled.Text`
	font-weight: 500;
`
const Location = styled.Text`
	font-size: 12px;
`

const IconsContainer = styled.View`
	flex-direction: row;
	margin-bottom: 10px;
`

const IconContainer = styled.View`
	margin-right: 10px;
`

const InfoContainer = styled.View`
	padding: 10px;
`

const Caption = styled.Text`
	margin: 3px 0px;
`

const CommentCount = styled.Text`
	margin-top: 5px;
	opacity: 0.5;
	font-size: 12px;
`

const CommentsContainer = styled.View`
	margin-top: 10px;
`

const Post = ({
	id,
	user,
	location,
	files = [],
	likeCount: likeCountProp,
	caption,
	comments = [],
	isLiked: isLikedProp
}) => {
	const [isLiked, setIsLiked] = useState(isLikedProp)
	const [likeCount, setlikeCount] = useState(likeCountProp)
	const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
		variables: {
			postId: id
		}
	})
	const handleLike = async () => {
		if (isLiked) {
			setlikeCount((l) => l - 1)
		} else {
			setlikeCount((l) => l + 1)
		}
		setIsLiked((p) => !p)
		try {
			await toggleLikeMutation()
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Container>
			<Header>
				<Touchable>
					<Image
						style={{ height: 40, width: 40, borderRadius: 20 }}
						source={{
							uri: user.avatar !== undefined ? user.avatar : ""
						}}
					/>
				</Touchable>
				<Touchable>
					<HeaderUserContainer>
						<Bold>{user.username}</Bold>
						<Location>{location}</Location>
					</HeaderUserContainer>
				</Touchable>
			</Header>
			<Swiper showsButtons style={{ height: constants.height / 2.5 }}>
				{files.map((file) => (
					<Image
						key={file.id}
						style={{
							width: constants.width,
							height: constants.height / 2.5
						}}
						source={{ uri: file.url }}
					/>
				))}
			</Swiper>
			<InfoContainer>
				<IconsContainer>
					<Touchable onPress={handleLike}>
						<IconContainer>
							<Ionicons
								color={
									isLiked
										? styles.redColor
										: styles.blackColor
								}
								name={
									Platform.os === "ios"
										? isLiked
											? "ios-heart"
											: "ios-heart-empty"
										: isLiked
										? "md-heart"
										: "md-heart-empty"
								}
								size={28}
							/>
						</IconContainer>
					</Touchable>
					<Touchable>
						<IconContainer>
							<Ionicons
								color={styles.blackColor}
								name={
									Platform.os === "ios"
										? "ios-text"
										: "md-text"
								}
								size={28}
							/>
						</IconContainer>
					</Touchable>
				</IconsContainer>

				<Touchable>
					<Bold>{`${likeCount}명이 좋아합니다. `}</Bold>
				</Touchable>
				<Touchable>
					<Caption>
						<Bold>{user.username} : </Bold>
						{caption}
					</Caption>
				</Touchable>
				{comments.length > 1 ? (
					<CommentsContainer>
						<Caption>
							{`${comments[0].user.username} : ${comments[0].text}`}
						</Caption>
						<Caption>
							{`${comments[1].user.username} : ${comments[1].text}`}
						</Caption>
						<Touchable>
							<CommentCount>
								추가로 {comments.length - 2}개의 댓글이
								있습니다.
							</CommentCount>
						</Touchable>
					</CommentsContainer>
				) : (
					<Caption>{comments[0].text}</Caption>
				)}
			</InfoContainer>
		</Container>
	)
}

Post.propTypes = {
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
}

export default Post
