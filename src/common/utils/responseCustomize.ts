export const responseCustomize = (
  data: {},
  totalItems = 0,
  page = 1,
  limit = 10,
) => {
  return {
    data,
    pagination: {
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};
