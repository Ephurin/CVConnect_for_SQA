export const useDashboardApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getOverview = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/overview?${queryString}`,
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

  const getOverviewOrg = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/overview?${queryString}`,
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

  const getPassRate = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/percent-passed?${queryString}`,
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

  const getPassRateOrg = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/percent-passed?${queryString}`,
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

  const getPassedByLevelOrg = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/pass-by-level?${queryString}`,
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

  const getEliminatedByReasonOrg = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/eliminated-reason?${queryString}`,
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

  const getCandidateTopApply = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/candidate-apply-most?${queryString}`,
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

  const getByEliminatedReason = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/eliminated-reason?${queryString}`,
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

  const getJobAdsByTime = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/job-ad-by-time?${queryString}`,
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

  const getJobAdsByHr = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/job-ad-by-hr?${queryString}`,
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

  const getJobAdsByDept = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/job-ad-by-department?${queryString}`,
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

  const getJobAdsByCareer = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/job-ad-by-career?${queryString}`,
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

  const getJobAdsByLevel = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/job-ad-by-level?${queryString}`,
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

  const getJobAdsFeatured = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/job-ad-featured?${queryString}`,
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

  const getJobAdsFeaturedOrg = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/org-admin/job-ad-featured?${queryString}`,
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

  const getOrgFeatured = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/organization-featured?${queryString}`,
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

  const getNewOrgByTime = async (
    payload: any,
    abortController?: AbortController,
  ) => {
    const _abortController = abortController;

    try {
      const queryString = objectToQuery(payload);
      const res = await $axios.get(
        `/core/dashboard/system-admin/new-org-by-time?${queryString}`,
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

  const getStaffSize = async (abortController?: AbortController) => {
    const _abortController = abortController;

    try {
      const res = await $axios.get(`/core/dashboard/system-admin/staff-size`, {
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

  return {
    getOverview,
    getPassRate,
    getCandidateTopApply,
    getByEliminatedReason,
    getJobAdsByTime,
    getJobAdsByCareer,
    getJobAdsByLevel,
    getJobAdsFeatured,
    getNewOrgByTime,
    getStaffSize,
    getOrgFeatured,

    getOverviewOrg,
    getPassRateOrg,
    getJobAdsByHr,
    getJobAdsByDept,
    getPassedByLevelOrg,
    getEliminatedByReasonOrg,
    getJobAdsFeaturedOrg,
  };
};
