const {assert} = require('chai');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '');
    });
  });

  describe("clicking create link", () => {
    it("navigates to create page", () => { 
      browser.url("/");

      browser.click("a[href='/items/create']");

      assert.include(browser.getText( "#item-title" ), "Create");
    });
  });
});
