const buildPaginationLinks = (
  req,
  query,
  sort,
  limit,
  prevPage,
  nextPage,
  hasPrevPage,
  hasNextPage
) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
  const queryParams = [];

  if (query) queryParams.push(`query=${query}`);
  if (sort) queryParams.push(`sort=${sort}`);
  if (limit) queryParams.push(`limit=${limit}`);

  const baseParams = queryParams.join("&");

  return {
    prevLink: hasPrevPage ? `${baseUrl}?${baseParams}&page=${prevPage}` : null,
    nextLink: hasNextPage ? `${baseUrl}?${baseParams}&page=${nextPage}` : null,
  };
};

export { buildPaginationLinks };
