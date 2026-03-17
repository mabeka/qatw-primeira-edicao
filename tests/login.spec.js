import { test, expect } from "@playwright/test";
import { obterCodigo2FA } from "../support/db";
import { LoginPage } from "../pages/LoginPage";
import { DashPage } from "../pages/DashPage";
import { getJob, cleanJobs } from "../support/redis";

const usuario = {
  cpf: "00000014141",
  senha: "147258",
};

test("Validar o Login com sucesso", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashPage = new DashPage(page);

  await cleanJobs(); // limpa a fila de autenticação em duas etapas
  await loginPage.acessarPagina();
  await loginPage.informaCPF(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);

  // antes tinha um time sleep de 3000ms e agora tem um modo mais sofisticado de esperar
  // checkpoint: verifica se o heading "Verificação em duas etapas" está presente na página
  await page
    .getByRole("heading", { name: "Verificação em duas etapas" })
    .waitFor({ timeout: 3000 });

  const codigo = await getJob();
  // const codigo = await obterCodigo2FA(usuario.cpf); // chama a funcão que obtém o código de autenticação
  await loginPage.informa2FA(codigo);

  // Aguardar o carregamento da página de saldo antes de fazer a asserção - Temporario
  // await page.waitForTimeout(2000);
  await expect(await dashPage.obterSaldo()).toHaveText("R$ 5.000,00");
});

test("Não deve logar quando o código de autenticação é inválido", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessarPagina();
  await loginPage.informaCPF(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);

  await page.waitForTimeout(3000);
  const codigo = "123456"; // Código de autenticação inválido
  await loginPage.informa2FA(codigo);
  await expect(page.locator("span")).toContainText(
    "Código inválido. Por favor, tente novamente.",
  );
});
