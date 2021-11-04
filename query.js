import { gql } from '@apollo/client';
import { PHOTO_FRAGMENT, USER_FRAGMENT } from './fragments';

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`;

export const COMMENTS_QUERY = gql`
  query seePhotoComments($id: Int!) {
    seePhotoComments(id: $id) {
      id
      user {
        ...UserFragment
      }
      photo {
        ...PhotoFragment
      }
      payload
      isMine
      createdAt
      updatedAt
    }
  }
  ${USER_FRAGMENT}
  ${PHOTO_FRAGMENT}
`;
