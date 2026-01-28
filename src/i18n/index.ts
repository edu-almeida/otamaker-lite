import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources: Resource = {
  en: {
    translation: {
      welcome: "Welcome to Otamaker Lite",
      stickerAnime: "Anime Stickers",
      packName: "Pack Name",
      author: "Pack Signature",
      communities: "Communities",
      contactMaker: "Contact Maker",
      download: "Download",
      search: "Search",
      aboutAnime: "About Anime",
      aboutMaker: "About Maker",
      new_packages: "New Packages",
    }
  },
  pt: {
    translation: {
      welcome: "Bem-vindo ao Otamaker Lite",
      stickerAnime: "Animes de Stickers",
      packName: "Nome do pacote",
      author: "Assinatura do pacote",
      communities: "Comunidades",
      contactMaker: "Fale com o Maker",
      download: "Baixar",
      search: "Buscar",
      aboutAnime: "Sobre o Anime",
      aboutMaker: "Sobre o Maker",
      new_packages: "Novos Pacotes",
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido a Otamaker Lite",
      stickerAnime: "Stickers de Anime",
      packName: "Nombre del paquete",
      author: "Firma del paquete",
      communities: "Comunidades",
      contactMaker: "Habla con el Maker",
      download: "Descargar",
      search: "Buscar",
      aboutAnime: "Sobre el Anime",
      aboutMaker: "Sobre el Maker",
      new_packages: "Nuevos Paquetes",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode ?? 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
