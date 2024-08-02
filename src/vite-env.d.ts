/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_SUPPORT_CONTACT_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
