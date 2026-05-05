export const useConversationApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getConversationMessages = async (
    jobAdId: any,
    candidateId: any,
    pageIndex: any,
    controller?: AbortController,
  ) => {
    const _abortController = controller;
    try {
      let url = `/notify/conversation/chat-messages?jobAdId=${jobAdId}&candidateId=${candidateId}&pageSize=20`;
      if (pageIndex != null) {
        url += `&pageIndex=${pageIndex}`;
      }
      const res = await $axios.get(url, {
        signal: _abortController ? _abortController.signal : undefined,
      });
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.add({
          title: err?.response?.data?.message || "Có lỗi xảy ra",
          color: "error",
        });
      }
      console.error(err);
      return null;
    }
  };

  const getConversationOrgInfo = async (
    jobAdId: any,
    controller?: AbortController,
  ) => {
    const _abortController = controller;
    try {
      const res = await $axios.get(
        `/core/org/outside/org-by-job-ad/${jobAdId}`,
        {
          signal: _abortController ? _abortController.signal : undefined,
        },
      );
      return res.data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  const readAllMessages = async (jobAdId: any, candidateId: any) => {
    try {
      const res = await $axios.post(
        `/notify/conversation/read-all-messages`,
        {
          jobAdId,
          candidateId,
        },
      );
      return res.data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  const sendMessage = async (jobAdId: any, candidateId: any, text: string) => {
    try {
      const res = await $axios.post(`/notify/conversation/new-message`, {
        jobAdId,
        candidateId,
        text,
      });
      return res.data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  const checkExistConversation = async (
    jobAdId: any,
    candidateId: any,
    controller?: AbortController,
  ) => {
    try {
      const res = await $axios.get(
        `/notify/conversation/check-exists/${jobAdId}/${candidateId}`,
        {
          signal: controller?.signal,
        },
      );
      return res.data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  const checkExistUnreadMessage = async (isCandidate: boolean) => {
    try {
      const res = await $axios.get(
        `/notify/conversation/check-exists-message-unread?isCandidate=${isCandidate}`,
      );
      return res.data;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  };

  const createConversation = async (jobAdId: any, candidateId: any) => {
    try {
      const res = await $axios.post(`/notify/conversation/create`, {
        jobAdId,
        candidateId,
      });
      toast.add({
        title: res.data.message,
        color: "success",
      });
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.add({
          title: err?.response?.data?.message || "Có lỗi xảy ra",
          color: "error",
        });
      }
      console.error(err);
      return null;
    }
  };

  return {
    checkExistConversation,
    getConversationOrgInfo,
    createConversation,
    getConversationMessages,
    checkExistUnreadMessage,
    sendMessage,
    readAllMessages,
  };
};
