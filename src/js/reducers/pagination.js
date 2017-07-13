import { combineReducers } from 'redux';
import paginate from './paginate';

import {
  SESSION_USER_COMMUNITIES_REQUEST,
  SESSION_USER_COMMUNITIES_SUCCESS,
  SESSION_USER_COMMUNITIES_FAILURE,
} from '../actions/session';

import {
  SOURCES_FETCH_REQUEST,
  SOURCES_FETCH_SUCCESS,
  SOURCES_FETCH_FAILURE,

  SOURCE_URLS_REQUEST,
  SOURCE_URLS_SUCCESS,
  SOURCE_URLS_FAILURE,

  SOURCE_ATTRIBUTED_URLS_REQUEST,
  SOURCE_ATTRIBUTED_URLS_SUCCESS,
  SOURCE_ATTRIBUTED_URLS_FAILURE,
} from '../actions/source';

import {
  CONTENT_RECENT_URLS_REQUEST,
  CONTENT_RECENT_URLS_SUCCESS,
  CONTENT_RECENT_URLS_FAILURE,
} from '../actions/content';

import {
  COMMUNITY_USERS_REQUEST,
  COMMUNITY_USERS_SUCCESS,
  COMMUNITY_USERS_FAILURE,
} from '../actions/communities';

// Updates the pagination data for different actions.
const pagination = combineReducers({
  sources: paginate({
    mapActionToKey: () => "created",
    types: [
      SOURCES_FETCH_REQUEST,
      SOURCES_FETCH_SUCCESS,
      SOURCES_FETCH_FAILURE,
    ],
  }),

  sourceUndescribedUrls: paginate({
    mapActionToKey: action => action.id,
    types: [
      SOURCE_URLS_REQUEST,
      SOURCE_URLS_SUCCESS,
      SOURCE_URLS_FAILURE,
    ],
  }),

  sourceAttributedUrls: paginate({
    mapActionToKey: action => action.id,
    types: [
      SOURCE_ATTRIBUTED_URLS_REQUEST,
      SOURCE_ATTRIBUTED_URLS_SUCCESS,
      SOURCE_ATTRIBUTED_URLS_FAILURE,
    ],
  }),

  contentRecentUrls: paginate({
    mapActionToKey: () => "created",
    types: [
      CONTENT_RECENT_URLS_REQUEST,
      CONTENT_RECENT_URLS_SUCCESS,
      CONTENT_RECENT_URLS_FAILURE,
    ],
  }),

  communityUsers: paginate({
    mapActionToKey: (a) => a.id,
    types: [
      COMMUNITY_USERS_REQUEST,
      COMMUNITY_USERS_SUCCESS,
      COMMUNITY_USERS_FAILURE,
    ],
  }),

  sessionUserCommunities: paginate({
    mapActionToKey: () => "communities",
    types: [
      SESSION_USER_COMMUNITIES_REQUEST,
      SESSION_USER_COMMUNITIES_SUCCESS,
      SESSION_USER_COMMUNITIES_FAILURE,
    ],
  }),
});

export default pagination;
