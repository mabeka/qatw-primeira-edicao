import pgPromise from "pg-promise";
const pgp = pgPromise();
const db = pgp('postgres://dba:dba@paybank-db:5432/UserDB'); // ver no docker compose.yml

// a funcão também resolve uma promessa então uso await - linha 13
export async function obterCodigo2FA(cpf) {
  const query = `
	SELECT t.code
	FROM public."TwoFactorCode" t
	JOIN public."User" u ON u."id" = t."userId"
	WHERE u."cpf"='${cpf}'
	ORDER BY t.id DESC
	LIMIT 1
  `;
  const result = await db.oneOrNone(query); //ela resolve uma promessa então uso await
  return result.code;
}
