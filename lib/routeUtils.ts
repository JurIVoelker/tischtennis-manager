export const isIgnoredMiddlewarePath = (urlPath: string): boolean => {
  const ignoredPaths = ["ungueltiger-link", "login"];
  if (urlPath === "/") return true;
  if (ignoredPaths.some((route) => urlPath.startsWith(`/${route}`)))
    return true;
  if (/^\/[^\/]+\/welcome(\?.*)?(\/.*)?$/.test(urlPath)) return true;
  const additionalRegexPaths = [
    /^\/.*\/mannschaftsfuehrer\/login(\?.*)?(\/.*)?$/,
    /^\/.*\/mannschaftsfuehrer\/registrieren(\?.*)?(\/.*)?$/,
    /^\/.*\/mannschaftsfuehrer\/passwort-vergessen(\?.*)?(\/.*)?$/,
    /^\/.*\/mannschaftsfuehrer\/passwort-reset(\?.*)?(\/.*)?$/,
  ];
  if (additionalRegexPaths.some((regex) => regex.test(urlPath))) return true;
  return false;
};
