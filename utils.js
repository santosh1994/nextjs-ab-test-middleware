const getCookie = (name, cookie) => {
  if (!cookie) {
    return null;
  }

  const cookies = cookie.split("; ");

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i]) {
      const [key, value] = cookies[i].split("=");

      if (key === name) {
        return value;
      }
    }
  }

  return null;
};

module.exports = {
  getCookie,
};
