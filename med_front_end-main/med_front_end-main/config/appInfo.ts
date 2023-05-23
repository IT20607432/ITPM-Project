const port = process.env.APP_PORT || 3000;

const apiBasePath = "/auth/";

export const websiteDomain =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  `http://localhost:${port}`;

export const appInfo = {
  appName: "SuperTokens Demo App",
  websiteDomain,
  apiDomain: "http://localhost:5500",
  apiBasePath,
};
