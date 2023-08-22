import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const url = 'https://demo-bank.vercel.app/';
    const userId = 'testerLO';
    const userPassword = 'password';
    const expectedUserName = 'Jan Demobankowy';

    // Act
    await page.goto(url);
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    //Arrange
    const url = 'https://demo-bank.vercel.app/';
    const userId = 'tester';
    const expectedMessage = 'identyfikator ma min. 8 znaków';

    //Act
    await page.goto(url);
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('login-input').blur();

    //Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedMessage
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    //Arrange
    const url = 'https://demo-bank.vercel.app/';
    const userPassword = 'haslo';
    const expectedMessage = 'hasło ma min. 8 znaków';

    //Act
    await page.goto(url);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('password-input').blur();

    //Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedMessage
    );
  });
});
