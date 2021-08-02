export const isObjEmpty = (obj) => {
  const result =
    typeof obj === "object" &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object;
  return result;
};

export const isArrayEmpty = (array) => {
  if (
    Array.isArray(array) ||
    Object.prototype.toString.call(array) === "[object Array]"
  ) {
    return Boolean(array.length);
  }
  return false;
};
