const toLower = (v) => v.toLowerCase();
const toUpper = (v) => v.toUpperCase();

const getRawFilterId = (filter) => filter.map((f) => f._id);

export { toLower, toUpper, getRawFilterId };
