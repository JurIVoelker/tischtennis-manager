export const setUserData = (data: object) => {
  if (typeof localStorage === "undefined")
    throw new Error("localStorage is not defined");
  if (typeof data !== "object") throw new Error("Data must be an object");

  const previousData = getUserData();
  const newData = { ...previousData, ...data };
  localStorage.setItem("userData", JSON.stringify(newData));
};

export const getUserData = () => {
  if (typeof localStorage === "undefined")
    throw new Error("localStorage is not defined");
  const userData = localStorage.getItem("userData");
  let parsedData;
  try {
    if (!userData) throw new Error("No user data found");
    parsedData = JSON.parse(userData);
  } catch (error) {
    return {};
  }
  return parsedData;
};
