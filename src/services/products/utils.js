const parseParamsList = (value, normalize = (value) => value.toLowerCase()) => {
  if (!value) return null;

  const cleanValue = String(value).trim();
  if (!cleanValue || cleanValue.toLowerCase() === "all") return null;

  const valuesArr = cleanValue
    .split(",")
    .map((value) => normalize(value.trim()))
    .filter(Boolean);

  return valuesArr.length ? valuesArr : null;
};

const buildPriceFilter = (minPrice, maxPrice) => {
  const min = Number(minPrice);
  const max = Number(maxPrice);

  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);

  if (!hasMin && !hasMax) return null;

  const price = {};
  if (hasMin) price.$gte = min;
  if (hasMax) price.$lte = max;
  return price;
};

const parsePagination = (
  { page, limit },
  { defaultPage = 1, defaultLimit = 12, maxLimit = 100 } = {}
) => {
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);

  const safePage = Number.isFinite(p) && p > 0 ? p : defaultPage;

  let safeLimit = Number.isFinite(l) && l > 0 ? l : defaultLimit;
  if (safeLimit > maxLimit) safeLimit = maxLimit;

  return { page: safePage, limit: safeLimit };
};

const buildPaginationLinks = (
  req,
  { page, limit, prevPage, nextPage, hasPrevPage, hasNextPage }
) => {
  const base = `${req.protocol}://${req.get("host")}${req.baseUrl || ""}${
    req.path
  }`;
  const original = new URLSearchParams(req.query);

  const make = (p) => {
    const qp = new URLSearchParams(original);
    qp.set("page", p);
    qp.set("limit", limit);
    return `${base}?${qp.toString()}`;
  };

  return {
    prevLink: hasPrevPage ? make(prevPage) : null,
    nextLink: hasNextPage ? make(nextPage) : null,
  };
};

export {
  parseParamsList,
  buildPriceFilter,
  parsePagination,
  buildPaginationLinks,
};
