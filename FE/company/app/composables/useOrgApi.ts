export const useOrgApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getOrgInfo = async () => {
    try {
      const res = await $axios.get(`/core/org/org-info`);
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

  const getOrgDetails = async (id: any) => {
    try {
      const res = await $axios.get(`/core/org/org-details/${id}`);
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

  const updateStatus = async (ids: any[], active: boolean) => {
    try {
      const res = await $axios.put(`/core/org/change-status-active`, {
        ids,
        active,
      });
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

  const getOrgEmployees = async (
    orgId: any,
    params?: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery({
        ...params,
        orgId,
      });
      const res = await $axios.get(
        `/user/org-member/org-member-by-org?${queryString}`,
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

  const getOrgs = async (params: any, abortController?: AbortController) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(params);
      const res = await $axios.get(`/core/org/filter?${queryString}`, {
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

  const getExport = async (params: any, abortController?: AbortController) => {
    try {
      const queryString = objectToQuery(params);

      const res = await $axios.get(`/core/org/filter/export?${queryString}`, {
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

  const getOrgInfoPublic = async (id: any) => {
    try {
      const res = await $axios.get(`/core/org/outside/org-info/${id}`);
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

  const updateLogo = async (payload: any) => {
    try {
      const res = await $axios.put(`/core/org/update-logo`, payload);
      // toast.add({
      //   title: res.data.message,
      //   color: "success",
      // });
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

  const updateCover = async (payload: any) => {
    try {
      const res = await $axios.put(`/core/org/update-cover-photo`, payload);
      // toast.add({
      //   title: res.data.message,
      //   color: "success",
      // });
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

  const updateInfo = async (payload: any) => {
    try {
      const res = await $axios.put(`/core/org/update-info`, payload);
      // toast.add({
      //   title: res.data.message,
      //   color: "success",
      // });
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
    getOrgInfo,
    updateLogo,
    updateCover,
    updateInfo,
    getOrgInfoPublic,
    getOrgs,
    getOrgDetails,
    getOrgEmployees,
    updateStatus,
    getExport,
  };
};
