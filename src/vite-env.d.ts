/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the CAM API (via Kong). Defaults to "/api" (same-origin proxy). */
  readonly VITE_API_BASE_URL?: string;
  /** Dev-only bearer token, used when no session token is present. Never set in prod. */
  readonly VITE_API_TOKEN?: string;
  /** Brand the console operates within (single-tenant, multi-brand). */
  readonly VITE_BRAND_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
