export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  const isPublic =
    path.startsWith("/api/auth/") ||
    path.startsWith("/api/_auth/") ||
    path.startsWith("/_nuxt/") ||
    !path.startsWith("/api/");
  if (!isPublic) {
    await requireUserSession(event);
  }
});
