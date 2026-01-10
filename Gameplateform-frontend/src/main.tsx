// Polyfill pour crypto.randomUUID dans les contextes non sécurisés
if (typeof window !== 'undefined' && !window.crypto.randomUUID) {
  // On force le type de la fonction pour correspondre à la signature native attendue par TS
  window.crypto.randomUUID = function(): ReturnType<Crypto["randomUUID"]> {
    return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
      const charCode = Number(c);
      return (
        charCode ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (charCode / 4)))
      ).toString(16);
    }) as ReturnType<Crypto["randomUUID"]>; // Assertion de type finale
  };
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
