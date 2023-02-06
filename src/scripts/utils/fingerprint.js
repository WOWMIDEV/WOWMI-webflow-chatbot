import configChatbot from '../config/chabot';
import Fingerprint2 from '../plugins/fp2';

let fingerprint = localStorage.getItem(configChatbot.key);

if (!fingerprint) {
  Fingerprint2.get((components) => {
    fingerprint = Fingerprint2.x64hash128(
      components.map((pair) => pair.value).join(),
      31,
    );
    localStorage.setItem(configChatbot.key, fingerprint);
  });
}
