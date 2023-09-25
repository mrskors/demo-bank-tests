import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  let pulpitPage: PulpitPage;

  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(userId, userPassword);

    pulpitPage = new PulpitPage(page);
  });
  test('quick payment with correct data', async ({ page }) => {
    // Arrange
    const reciverId = '2';
    const transferAmount = '150';
    const transferTitle = 'pizza';
    const expectedTransferReceiver = 'Chuck Demobankowy';

    // Act
    await pulpitPage.transferReceiver.selectOption(reciverId);
    await pulpitPage.transferAmount.fill(transferAmount);
    await pulpitPage.transferTitle.fill(transferTitle);

    await pulpitPage.transferButton.click();
    await pulpitPage.actionCloseButton.click();

    // Assert
    await expect(pulpitPage.messageText).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    // Arrange
    const topUpReceiver = '500 xxx xxx';
    const topupAmount = '10';
    const expectedMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topUpReceiver}`;

    //Act
    await pulpitPage.topupReceiverInput.selectOption(topUpReceiver);
    await pulpitPage.topupAmount.fill(topupAmount);
    await pulpitPage.topupAgreementCheckbox.click();
    await pulpitPage.topupExecuteButton.click();
    await pulpitPage.actionCloseButton.click();

    //Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', async ({ page }) => {
    // Arrange
    const phoneNumber = '500 xxx xxx';
    const topupAmount = '10';
    const initialBalance = await pulpitPage.moneyValueText.innerText();
    const expectedBalance = Number(initialBalance) - Number(topupAmount);

    //Act
    await pulpitPage.topupReceiverInput.selectOption(phoneNumber);
    await pulpitPage.topupAmount.fill(topupAmount);
    await pulpitPage.topupAgreementCheckbox.click();
    await pulpitPage.topupExecuteButton.click();
    await pulpitPage.actionCloseButton.click();

    //Assert
    await expect(pulpitPage.moneyValueText).toHaveText(`${expectedBalance}`);
  });
});
