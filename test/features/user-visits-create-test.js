const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

// Add your tests below:
describe("User visits create page", () => {
	describe("Creates new gather", () => { 
		it("submits and displays entered content", () => {
			let inputData = buildItemObject();

			browser.url("/items/create");
			browser.setValue("#title-input", inputData.title);
			browser.setValue("#description-input", inputData.description);
			browser.setValue("#imageUrl-input", inputData.imageUrl);
			browser.click("#submit-button");
			
			assert.include(browser.getText("body"), inputData.title);
			assert.include(browser.getText("body"), inputData.description);
			assert.include(browser.getAttribute("body img", "src"), inputData.imageUrl);
		 });
	});
 });
