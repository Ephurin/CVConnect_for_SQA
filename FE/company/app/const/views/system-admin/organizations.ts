export const organizationTableHeaders = [
  {
    accessorKey: "index",
    header: "STT",
    meta: {
      class: {
        th: "min-w-[56px]",
      },
    },
  },
  {
    accessorKey: "orgName",
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
    accessorKey: "website",
    header: "Trang web",
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
    accessorKey: "companySize",
    header: "Số lượng nhân sự",
    allowFilter: true,
    filterType: "select",
    isSortable: false,
    isSingle: true,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[440px] truncate",
        td: "pl-[32px] max-w-[440px] truncate",
      },
    },
  },
  {
    accessorKey: "industryList",
    header: "Lĩnh vực",
    allowFilter: true,
    filterType: "select",
    isSortable: false,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[440px] truncate",
        td: "pl-[32px] max-w-[440px] truncate",
      },
    },
  },
  {
    accessorKey: "addresses",
    header: "Địa chỉ",
    allowFilter: true,
    filterType: "select",
    isSortable: false,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[440px] truncate",
        td: "pl-[32px] max-w-[440px] truncate",
      },
    },
  },
  {
    accessorKey: "isActive",
    header: "Hoạt động",
    allowFilter: true,
    filterType: "select",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[240px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    isSortable: true,
    allowFilter: true,
    filterType: "date",
    meta: {
      class: {
        th: "min-w-[248px] max-w-[248px] truncate",
        td: "max-w-[248px] truncate",
      },
    },
  },
  {
    accessorKey: "createdBy",
    header: "Người tạo",
    isSortable: true,
    allowFilter: true,
    filterType: "text",
    meta: {
      class: {
        th: "min-w-[168px] max-w-[168px] truncate",
        td: "max-w-[168px] truncate",
      },
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    isSortable: true,
    filterType: "date",
    allowFilter: true,
    meta: {
      class: {
        th: "min-w-[248px] max-w-[248px] truncate",
        td: "max-w-[248px] truncate",
      },
    },
  },
  {
    accessorKey: "updatedBy",
    header: "Người cập nhật",
    filterType: "text",
    isSortable: true,
    allowFilter: true,
    meta: {
      class: {
        th: "min-w-[168px] max-w-[168px] truncate",
        td: "max-w-[168px] truncate",
      },
    },
  },
];

export const organizationEmployeeTableHeaders = [
  {
    accessorKey: "index",
    header: "STT",
    meta: {
      class: {
        th: "min-w-[56px]",
      },
    },
  },
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
    accessorKey: "username",
    header: "Tên đăng nhập",
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
    accessorKey: "isEmailVerified",
    header: "Xác thực email",
    allowFilter: true,
    filterType: "select",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[150px] pl-[32px] max-w-[200px] truncate",
        td: "pl-[32px] max-w-[200px] truncate",
      },
    },
  },
  {
    accessorKey: "isActive",
    header: "Hoạt động",
    allowFilter: true,
    filterType: "select",
    isSortable: true,
    meta: {
      class: {
        th: "min-w-[240px] pl-[32px] max-w-[280px] truncate",
        td: "pl-[32px] max-w-[280px] truncate",
      },
    },
  },
  {
    accessorKey: "roleIds",
    header: "Vai trò",
    allowFilter: true,
    filterType: "select",
    isSortable: false,
    meta: {
      class: {
        th: "min-w-[200px] pl-[32px] max-w-[440px] truncate",
        td: "pl-[32px] max-w-[440px] truncate",
      },
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    isSortable: true,
    allowFilter: true,
    filterType: "date",
    meta: {
      class: {
        th: "min-w-[248px] max-w-[248px] truncate",
        td: "max-w-[248px] truncate",
      },
    },
  },
  {
    accessorKey: "inviter",
    header: "Người mời",
    isSortable: true,
    allowFilter: true,
    filterType: "text",
    meta: {
      class: {
        th: "min-w-[248px] max-w-[248px] truncate",
        td: "max-w-[248px] truncate",
      },
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    isSortable: true,
    filterType: "date",
    allowFilter: true,
    meta: {
      class: {
        th: "min-w-[248px] max-w-[248px] truncate",
        td: "max-w-[248px] truncate",
      },
    },
  },
  {
    accessorKey: "updatedBy",
    header: "Người cập nhật",
    filterType: "text",
    isSortable: true,
    allowFilter: true,
    meta: {
      class: {
        th: "min-w-[168px] max-w-[168px] truncate",
        td: "max-w-[168px] truncate",
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
