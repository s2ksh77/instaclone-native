import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Image, useWindowDimensions } from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/core';
import { COMMENTS_QUERY } from '../query';
import CommentRow from './CommentRow';

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 10px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Photo = ({ id, user, caption, file, isLiked, likes }) => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(300);
  const [moreComment, setMoreComment] = useState(false);

  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height / 5);
    });
  }, [file]);

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  const goToProfile = () => {
    navigation.navigate('Profile', {
      id: user.id,
      username: user.username,
    });
  };

  const goToComments = () => {
    navigation.navigate('Comments', {
      photoId: id,
      username: user.username,
      avatar: user.avatar,
      caption,
    });
  };

  const goToLikes = () => {
    navigation.navigate('Likes', { photoId: id });
  };

  const { data: commentsData } = useQuery(COMMENTS_QUERY, {
    variables: {
      id,
    },
  });

  const moreComments = () => setMoreComment(!moreComment);
  const renderComment = ({ item: comment }) => <CommentRow {...comment} />;

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar resizeMode="cover" source={{ uri: user?.avatar }} />
        <Username>{user?.username}</Username>
      </Header>
      {/* <File
        resizeMode="contain"
        style={{ width, height: imageHeight }}
        source={{ uri: file }}
      /> */}
      {/* <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              color={isLiked ? 'tomato' : 'white'}
              size={22}
            />
          </Action>
          <Action onPress={goToComments}>
            <Ionicons name="chatbubble-outline" color="white" size={22} />
          </Action>
        </Actions>
        <TouchableOpacity onPress={goToLikes}>
          <Likes>{likes === 1 ? '1 like' : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user?.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption ? caption : ''}</CaptionText>
        </Caption>
        <Caption>
          <TouchableOpacity onPress={moreComments}>
            <CaptionText>
              {commentsData?.seePhotoComments?.length > 0
                ? moreComment
                  ? '숨기기'
                  : '더 보기'
                : null}
            </CaptionText>
          </TouchableOpacity>
        </Caption>
        {moreComment ? (
          <FlatList
            data={commentsData?.seePhotoComments}
            keyExtractor={(comment) => '' + comment.id}
            renderItem={renderComment}
          />
        ) : null}
      </ExtraContainer> */}
    </Container>
  );
};

Photo.propTypes = {
  id: PropTypes.number,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string,
  }),
  caption: PropTypes.string,
  file: PropTypes.string,
  isLiked: PropTypes.bool,
  likes: PropTypes.number,
};

export default Photo;
