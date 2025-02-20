/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly VITE_ADDITIONAL_USER_GOLD_PLAN_PRICE_ID: string;
  readonly VITE_ADDITIONAL_USER_SILVER_PLAN_PRICE_ID: string;
  readonly VITE_ADDITIONAL_USER_BRONZE_PLAN_PRICE_ID: string;
  readonly VITE_FREE_EMPLOYEES_LIMIT_BRONZE_PLAN: number;
  readonly VITE_FREE_EMPLOYEES_LIMIT_SILVER_PLAN: number;
  readonly VITE_FREE_EMPLOYEES_LIMIT_GOLD_PLAN: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
