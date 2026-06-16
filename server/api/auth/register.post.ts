import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event);

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, message: "Alle Felder sind erforderlich." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createError({ statusCode: 409, message: "E-Mail bereits vergeben." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash },
    select: { id: true, name: true, email: true },
  });

  await setUserSession(event, { user });
  return user;
});
