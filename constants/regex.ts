export const INDEX_PAGE_REGEX = /^\/$/;
export const ADMIN_PAGE_REGEX = /^\/[^\/]+\/[^\/]+\/login(\?.*)?$/i;
export const TEAM_CLUB_PAGES_REGEX = /^\/[^\/]+\/[^\/]+\/[^\/]+(\?.*)?$/;
export const LOGIN_PAGE_REGEX = /^\/[^\/]+\/[^\/]+\/login(\?.*)?$/i;
export const LEADER_LOGIN_PAGES_REGEX =
  /^\/[^\/]+\/[^\/]+\/mannschaftsfuehrer\/login(\/.*)?(\?.*)?$/i;
export const INVALID_LINK_PAGE_REGEX = /^\/ungueltiger-link$/;
export const WELCOME_PAGE_REGEX = /^\/[^\/]+\/welcome.*$/;
