export const PUB_SUB_TOPIC = {
  CHECK_UNREAD: "checkUnread",
  MESSAGE_READ: "messageRead",
  NEW_MESSAGE: "newMessage",
  NEW_CONVERSATION: "newConversation",
};

export const usePubSubStore = defineStore("pubSub", () => {
  const stream = ref<any>({
    chatStream: null,
  });

  const subscribe = computed(() => {
    return (channel: string) => {
      return stream.value[channel];
    };
  });

  function push(channel: string, message: any) {
    stream.value[channel] = {
      ...message,
      timestamp: new Date(),
    };
  }

  return {
    stream,
    subscribe,
    push,
  };
});
