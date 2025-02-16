export const isIgnoredMiddlewarePath = (urlPath: string): boolean => {
  const ignoredPaths = ["", "ungueltiger-link", "login"];
  if (ignoredPaths.some((route) => urlPath.startsWith(`/${route}`)))
    return true;
  if (/^\/[^\/]+\/welcome(\?.*)?(\/.*)?$/.test(urlPath)) return true;
  const additionalRegexPaths = [/^\/.*\/.*\/mannschaftsfuehrer\/login(\/.*)?$/];
  if (additionalRegexPaths.some((regex) => regex.test(urlPath))) return true;
  return false;
};
