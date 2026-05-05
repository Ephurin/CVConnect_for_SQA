export const useRoleApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getMyRoles = async () => {
    try {
      const res = await $axios.get(`/user/user/my-roles`);
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

  const getRoles = async (params: any, abortController?: AbortController) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(params);
      const res = await $axios.get(`/user/role/filter?${queryString}`, {
        signal: _abortController ? _abortController.signal : undefined,
      });
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

  const getUserGroupDetail = async (id: number) => {
    try {
      const res = await $axios.get(`/user/role/detail/${id}`);
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

  const getMemberTypes = async () => {
    try {
      const res = await $axios.get(`/user/role/member-type`);
      return res.data;
    } catch (err: any) {
      if (err.response && err?.response?.data?.message) {
        toast.add({
          title: err?.response?.data?.message || "Có lỗi xảy ra",
          color: "error",
        });
      } else {
        toast.add({
          title: "Có lỗi xảy ra",
          color: "error",
        });
      }
      console.error(err);
      return [];
    }
  };

  const createUserGroup = async (payload: any) => {
    try {
      const res = await $axios.post(`/user/role/create`, payload);
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

  const updateUserGroup = async (id: number, payload: any) => {
    try {
      const res = await $axios.put(`/user/role/update/${id}`, payload);
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

  const deleteUserGroup = async (payload: any) => {
    try {
      const res = await $axios.delete(`/user/role/delete`, {
        data: payload.ids,
      });
      if (res.data.message) {
        toast.add({
          title: res.data.message,
          color: "success",
        });
      }
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

  return {
    getRoles,
    getMemberTypes,
    createUserGroup,
    deleteUserGroup,
    getUserGroupDetail,
    updateUserGroup,
    getMyRoles,
  };
};
