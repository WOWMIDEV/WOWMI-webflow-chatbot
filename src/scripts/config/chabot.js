import chatName from './chatName';
import { member } from './member';
import link from './link';
import SimpleChatbot from '../plugins/chatbot';

const config = {
  btn: '.chatbot__btn',
  chatbot: null,
  chatName: chatName(),
  member: member(),
  link: link(),
  key: 'fingerprint',
  replicas: '',
  root: SimpleChatbot.createTemplate(),
  url: '',
};

export default config;
