/** Replace a controlled text field without relying on navigation to reset it. */
export async function replaceQaInput(page, selector, value) {
  await page.click(selector, { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type(selector, value);
  return page.$eval(selector, (input, expected) => input.value === expected, value);
}
