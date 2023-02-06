const chatName = () => {
  const el = document.querySelector('[data-chat="name"]');

  return el ? el.textContent : 'Chat';
};

export default chatName;
