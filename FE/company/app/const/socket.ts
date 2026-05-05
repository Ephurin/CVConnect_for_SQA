import { API_URL } from "~/plugins/axios";

export const SOCKET_ENDPOINT = "http://localhost:8888";

export const SOCKET_EVENT = {
  NOTIFY: "notify",
  UNREAD_NOTIFY: "unread_notify",
};

export const SOCKET_CHAT_EVENT = {
  RECEIVE_MESSAGE: "receive_message",
  NEW_MESSAGE: "new_message",
  READ_ALL_MESSAGE: "read_all_messages",
  NEW_CONVERSATION: "new_conversation",
};
