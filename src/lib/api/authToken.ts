/**
 * In-memory JWT for Authorization header (pairs with HttpOnly cookie).
 * @fastify/jwt prefers Bearer when present, which avoids edge cases where multipart + CORS omit the cookie.
 */
let bearerToken: string | null = null;

export const setBearerToken = (token: string | null | undefined) => {
  bearerToken = typeof token === "string" && token.trim() ? token.trim() : null;
};

export const getBearerToken = () => bearerToken;

export const clearBearerToken = () => {
  bearerToken = null;
};
