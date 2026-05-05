export const useSystemUserApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getUsers = async (params: any, abortController?: AbortController) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(params);
      const res = await $axios.get(`/user/user/filter?${queryString}`, {
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

  const getUserDetailAdmin = async (userId: any) => {
    try {
      const res = await $axios.get(
        `/user/user/user-detail-for-system-admin/${userId}`,
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

  const getExport = async (params: any, abortController?: AbortController) => {
    try {
      const queryString = objectToQuery(params);

      const res = await $axios.get(`/user/user/filter/export?${queryString}`, {
        responseType: "blob",
        signal: abortController?.signal,
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      let filename = "export.xlsx";
      const disposition = res.headers["content-disposition"];
      if (disposition?.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (err: any) {
      if (err.name === "AbortError") return null;

      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            toast.add({ title: json.message, color: "error" });
          } catch {
            toast.add({ title: "Lỗi xuất dữ liệu", color: "error" });
          }
        };
        reader.readAsText(err.response.data);
      }
      return null;
    }
  };

  const changeAdminStatus = async (userId: any, status: boolean) => {
    try {
      const url = status
        ? `/user/user/assign-role-system-admin/${userId}`
        : `/user/user/retrieve-role-system-admin/${userId}`;
      const res = await $axios.put(url);
      toast.add({
        title: res.data.message,
        color: "success",
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

  return {
    getUsers,
    getExport,
    getUserDetailAdmin,
    changeAdminStatus,
  };
};
