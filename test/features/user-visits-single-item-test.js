const {assert} = require('chai');
const { buildItemObject } = require('../test-utils');

describe("User views single gather item", () => { 
	describe("submits and views new gather", () => { 
		it("displays item on view page", () => {
			let inputData = buildItemObject({
				description: "totally worth gathering"
			});

			browser.url("/items/create");
			browser.setValue("#title-input", inputData.title);
			browser.setValue("#description-input", inputData.description);
			browser.setValue("#imageUrl-input", inputData.imageUrl);
			browser.click("#submit-button");
			
			browser.click(".item-card:last-child .view-button a");

			assert.include(browser.getUrl(), "/items");
			assert.include(browser.getText("body"), inputData.description);
		 });
	});
});