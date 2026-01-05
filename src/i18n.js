import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/common.json';
import es from '../public/locales/es/common.json';
import fr from '../public/locales/fr/common.json';
import pt from '../public/locales/pt/common.json';
import de from '../public/locales/de/common.json';
import it from '../public/locales/it/common.json';
import ja from '../public/locales/ja/common.json';
import zh from '../public/locales/zh/common.json';
import ar from '../public/locales/ar/common.json';
import ru from '../public/locales/ru/common.json';
import hi from '../public/locales/hi/common.json';
import ko from '../public/locales/ko/common.json';
import nl from '../public/locales/nl/common.json';
import pl from '../public/locales/pl/common.json';
import tr from '../public/locales/tr/common.json';
import sv from '../public/locales/sv/common.json';
import da from '../public/locales/da/common.json';
import no from '../public/locales/no/common.json';
import fi from '../public/locales/fi/common.json';
import cs from '../public/locales/cs/common.json';
import hu from '../public/locales/hu/common.json';
import ro from '../public/locales/ro/common.json';
import el from '../public/locales/el/common.json';
import vi from '../public/locales/vi/common.json';
import id from '../public/locales/id/common.json';
import th from '../public/locales/th/common.json';
import uk from '../public/locales/uk/common.json';
import he from '../public/locales/he/common.json';
import fa from '../public/locales/fa/common.json';
import ur from '../public/locales/ur/common.json';
import bn from '../public/locales/bn/common.json';
import ta from '../public/locales/ta/common.json';
import te from '../public/locales/te/common.json';
import ml from '../public/locales/ml/common.json';
import kn from '../public/locales/kn/common.json';
import mr from '../public/locales/mr/common.json';
import gu from '../public/locales/gu/common.json';
import pa from '../public/locales/pa/common.json';
import my from '../public/locales/my/common.json';
import km from '../public/locales/km/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      es: { common: es },
      fr: { common: fr },
      pt: { common: pt },
      de: { common: de },
      it: { common: it },
      ja: { common: ja },
      zh: { common: zh },
      ar: { common: ar },
      ru: { common: ru },
      hi: { common: hi },
      ko: { common: ko },
      nl: { common: nl },
      pl: { common: pl },
      tr: { common: tr },
      sv: { common: sv },
      da: { common: da },
      no: { common: no },
      fi: { common: fi },
      cs: { common: cs },
      hu: { common: hu },
      ro: { common: ro },
      el: { common: el },
      vi: { common: vi },
      id: { common: id },
      th: { common: th },
      uk: { common: uk },
      he: { common: he },
      fa: { common: fa },
      ur: { common: ur },
      bn: { common: bn },
      ta: { common: ta },
      te: { common: te },
      ml: { common: ml },
      kn: { common: kn },
      mr: { common: mr },
      gu: { common: gu },
      pa: { common: pa },
      my: { common: my },
      km: { common: km },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;