import ChatExceptions from '../helpers/chatExceptions';

const link = (name) => {
  const htmlLink = (agentLink, agentName) => {
    const isUrl = agentLink.startsWith('http');
    let outLink = '';

    if (isUrl) {
      outLink = `<a class='chatbot__member-link' href='${agentLink}' target='_blank'>You can grab a time on ${agentName} calendar here!</a>`;
    } else {
      outLink = `<p>Please <a class='chatbot__member-link' href='mailto:${agentLink}'>email</a> me to schedule the meeting</p>`;
    }

    return outLink;
  };

  const agentLink = document.querySelector('[data-chat="link"]');

  if (!agentLink) {
    throw new ChatExceptions('Need element :: [data-chat="link"] > agent url or email');
  }

  return htmlLink(agentLink.textContent, name);
};

export default link;
