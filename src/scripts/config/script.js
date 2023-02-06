import script1 from '../data/script-1.json'; // Originator
import script2 from '../data/script-2.json'; // Recruiter
import script3 from '../data/script-3.json'; // Realtor
import { member, memberFirstName } from './member';
import link from './link';

/**
 * Добавляем имя агента
 * Конвертируем в строку
 * находим {{member}}
 * меняем на значение из функции member()
 * конвертируем обратно в JSON
 * @returns {Object}
 */
const formatScript = (script) => {
  // eslint-disable-next-line no-underscore-dangle
  let _s = JSON.stringify(script);
  _s = _s.replace('{{member}}', member());
  _s = _s.replace('{{member-first-name}}', memberFirstName());
  _s = _s.replace('{{link}}', link(memberFirstName()));
  return JSON.parse(_s);
};

const script = (id) => {
  const scripts = {
    1: script1,
    2: script2,
    3: script3,
  };

  return formatScript(scripts[id]);
};

export default script;
