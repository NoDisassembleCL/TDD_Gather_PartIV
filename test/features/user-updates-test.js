const {assert} = require('chai');
const { buildItemObject } = require('../test-utils');

describe("User updates gather item", () => { 
	describe("submits, views and updates new gather", () => { 
		// This feels super brittle to me...
		it("goes to proper update page", () => {
			let inputData = buildItemObject();

			browser.url("/items/create");
			browser.setValue("#title-input", inputData.title);
			browser.setValue("#description-input", inputData.description);
			browser.setValue("#imageUrl-input", inputData.imageUrl);
			browser.click("#submit-button");

			browser.click(".item-card:last-child .view-button a" );
			browser.click("#update-link");

			assert.include(browser.getUrl(), "update");
		});
		
		// This feels super brittle to me...
		it("fields get updated", () => {
			let inputData = buildItemObject();
			let updatedTitle = "Updated Title";
			let updatedDesc = "Updated Desc";
			let updatedUrl = "http://placebear.com/g/250/350";

			browser.url("/items/create");
			browser.setValue("#title-input", inputData.title);
			browser.setValue("#description-input", inputData.description);
			browser.setValue("#imageUrl-input", inputData.imageUrl);
			browser.click("#submit-button");

			browser.click(".item-card:last-child .view-button a");
			browser.click("#update-link");

			browser.setValue("#title-input", updatedTitle);
			browser.setValue("#description-input", updatedDesc);
			browser.setValue("#imageUrl-input", updatedUrl);
			browser.click("#submit-button");
			
			assert.include(browser.getText("body"), updatedTitle);
			assert.include(browser.getText("body"), updatedDesc);
			assert.include(browser.getAttribute("body img", "src"), updatedUrl);
		});
	});
});