export const useMenuApi = () => {
  const { $axios } = useNuxtApp();
  const toast = useToast();

  const getAllMenus = async (memberType: string) => {
    try {
      const res = await $axios.get(
        `/user/menu/all-menus?memberType=${memberType}`,
      );
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
    getAllMenus,
  };
};
