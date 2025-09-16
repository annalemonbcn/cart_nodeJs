const flatten = (obj, prefix = "") => {
  const res = {};
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(res, flatten(value, newKey));
    } else {
      res[newKey] = value;
    }
  }
  return res;
};

export { flatten };
