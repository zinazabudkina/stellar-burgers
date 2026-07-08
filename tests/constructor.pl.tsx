import { test, expect } from '@playwright/test';

test.describe('тестируем конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ /*api/ingredients',
      update: false
    });

    await page.goto('/');
  });
  test('должен загружать ингредиенты из HAR', async ({ page }) => {
    const ingredients = page.getByTestId('ingredients');

    await expect(ingredients).toBeVisible();
  });

  test('добавление ингредиента в конструктор', async ({ page }) => {
    const ingredientCard = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await ingredientCard
      .locator('button')
      .filter({ hasText: 'Добавить' })
      .click();

    const constructor = page.getByTestId('constructor');

    await expect(constructor).toContainText('Краторная булка');
  });

  test('открытие и закрытие модалки ингредиента по клику на кнопку', async ({
    page
  }) => {
    const ingredient = page.getByText('Соус Spicy-X');

    await ingredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('закрытие модалки по overlay', async ({ page }) => {
    const ingredient = page.getByText('Соус Spicy-X');

    await ingredient.click();

    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('нельзя создать заказ без авторизации', async ({ page }) => {
    await page.goto('/');

    const bun = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bun.locator('button').filter({ hasText: 'Добавить' }).click();
    const ingredient = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await ingredient.locator('button').filter({ hasText: 'Добавить' }).click();

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    await expect(page).toHaveURL('/login');
  });

  test('создание заказа авторизованным пользователем', async ({
    page,
    context
  }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user'
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders'
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients')).toBeVisible();

    const bun = page
      .getByTestId('ingredient')
      .filter({
        hasText: 'Краторная булка N-200i'
      })
      .first();

    await bun.locator('button').filter({ hasText: 'Добавить' }).click();

    const ingredient = page
      .getByTestId('ingredient')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      })
      .first();

    await ingredient.locator('button').filter({ hasText: 'Добавить' }).click();

    await page
      .getByRole('button', {
        name: 'Оформить заказ'
      })
      .click();

    const modal = page.getByTestId('modal');

    await expect(page.getByTestId('order-number')).toBeVisible();

    await expect(page.getByTestId('order-number')).toContainText('107793');

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).not.toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
