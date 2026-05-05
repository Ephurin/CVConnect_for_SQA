export const candidateOnboardTableHeaders = [
  {
    accessorKey: "index",
    header: "STT",
    meta: {
      class: {
        th: "min-w-[56px]",
      },
    },
  },
  // {
  //   id: "id",
  //   accessorKey: "id",
  // },
  // {
  //   id: "groupId",
  //   accessorKey: "groupId",
  // },
  {
    accessorKey: "fullName",
    header: "Tên",
    allowFilter: true,
    filterType: "text",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    allowFilter: true,
    filterType: "text",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "phone",
    header: "SĐT",
    allowFilter: true,
    filterType: "text",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    allowFilter: true,
    filterType: "select",
    isSingle: true,
    isSortable: false,
    meta: {
      class: {
        th: "min-w-[220px] pl-[32px] max-w-[220px] truncate",
        td: "pl-[32px] max-w-[220px] truncate text-right",
      },
    },
  },
  {
    accessorKey: "onboardDate",
    header: "Ngày onboard",
    allowFilter: true,
    filterType: "date",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "applyDate",
    header: "Ngày ứng tuyển",
    allowFilter: true,
    filterType: "date",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "hrContact",
    header: "Người phụ trách",
    allowFilter: true,
    filterType: "select",
    isSingle: true,
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[240px] pl-[32px] max-w-[240px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  // {
  //   accessorKey: "jobAdTitle",
  //   header: "Tên tin tuyển dụng",
  //   allowFilter: true,
  //   filterType: "text",
  //   isSortable: true,
  //   meta: {
  //     class: {
  //       th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
  //       td: "pl-[32px] max-w-[280px] truncate",
  //     },
  //   },
  // },
  {
    accessorKey: "level",
    header: "Cấp bậc",
    allowFilter: true,
    isSingle: true,
    filterType: "select",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
];

export const pageSizeOptions = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
];
