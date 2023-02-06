const timeDate = () => {
  const now = new Date();
  return `${now.toLocaleString()}GMT ${
    -now.getTimezoneOffset() < 0 ? '-' : '+'
  }${Math.abs(now.getTimezoneOffset() / 60)}`;
};

export default timeDate;
