/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_SUPPORT_CONTACT_NUMBER: string;
  readonly VITE_API_STAGE_BASEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
