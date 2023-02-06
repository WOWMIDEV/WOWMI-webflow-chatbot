const member = () => {
  const agent = document.querySelector('[data-chat="member"]');

  return agent ? agent.textContent : 'I';
};

/**
 * Возвращает первое слово всего имени
 * если имя равно I, то подставляет слово my вместо имени
 * @param name
 * @returns {*}
 */
const memberFirstName = () => {
  const name = member();
  const firstName = name.split(' ')[0];

  return firstName === 'I' ? 'my' : `${firstName}'s`;
};

export { member, memberFirstName };
