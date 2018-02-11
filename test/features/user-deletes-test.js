const {assert} = require('chai');
const { buildItemObject } = require('../test-utils');

describe("User deletes item", () => {
	describe("create and delete", () => {
		it("successfully deletes item", () => {
			let inputData = buildItemObject({
				description: "totally worth gathering"
			});

			browser.url("/items/create");
			browser.setValue("#title-input", inputData.title);
			browser.setValue("#description-input", inputData.description);
			browser.setValue("#imageUrl-input", inputData.imageUrl);
			browser.click("#submit-button");
		
			browser.url("/");
			let createdItemId = browser.getAttribute(".item-card:last-child", "id");
			browser.submitForm(".item-card:last-child form.delete-form");
		
			assert.include(browser.getHTML("body"), 'id="items-container"');
			assert.notInclude(browser.getText("body"), createdItemId);
		});	
	});
 });