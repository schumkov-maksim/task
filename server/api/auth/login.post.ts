import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, message: "E-Mail und Passwort erforderlich." });
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    throw createError({ statusCode: 401, message: "Ungültige Anmeldedaten." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Ungültige Anmeldedaten." });
  }

  await setUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email },
  });

  return { id: user.id, name: user.name, email: user.email };
});
