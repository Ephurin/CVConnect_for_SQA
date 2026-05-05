export const useUserApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getByRoleCode = async (
    roleCode: string,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const res = await $axios.get(
        `/user/user/get-by-role-code-org/${roleCode}`,
        {
          signal: _abortController ? _abortController.signal : undefined,
        },
      );
      return res.data;
    } catch (err: any) {
      if (err.name === "AbortError") {
        return null;
      }

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

  const updatePassword = async (payload: any) => {
    try {
      const res = await $axios.put("/user/user/update-password", payload);

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

  const updateAvatar = async (payload: any) => {
    try {
      const res = await $axios.put(`/user/user/update-avatar`, payload);
      toast.add({
        title: res.data.message,
        color: "success",
      });
      return true;
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.add({
          title: err?.response?.data?.message || "Có lỗi xảy ra",
          color: "error",
        });
      }
      console.error(err);
      return false;
    }
  };

  const updateProfile = async (payload: any) => {
    try {
      const res = await $axios.put(`/user/user/update-info`, payload);
      toast.add({
        title: res.data.message,
        color: "success",
      });
      return true;
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.add({
          title: err?.response?.data?.message || "Có lỗi xảy ra",
          color: "error",
        });
      }
      console.error(err);
      return false;
    }
  }

  const getMyProfile = async () => {
    try {
      const res = await $axios.get("/user/user/my-profiles");

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
    getByRoleCode,
    updatePassword,
    getMyProfile,
    updateAvatar,
    updateProfile,
  };
};
