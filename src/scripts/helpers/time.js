const time = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export default time;
