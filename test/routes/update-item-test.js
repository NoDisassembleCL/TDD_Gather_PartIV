const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {
	beforeEach(connectDatabaseAndDropData);
  
	afterEach(diconnectDatabase);

	describe("GET", () => {
		it("fills fields with current data", async () => { 
			let createdItem = await seedItemToDatabase();

			let response = await request(app).get(`/items/${createdItem._id}/update`);

			assert.include(response.text, createdItem.title);
			assert.include(response.text, createdItem.description);
			assert.include(response.text, createdItem.imageUrl);
		});
	});

	describe("POST", () => {
		it("updates item in the database", async () => {
			let createdItem = await seedItemToDatabase();
			let updatedTitle = "Updated Title";
			let updatedDesc = "Updated Desc";
			let updatedImageUrl = "Updated Image Url";

			let updatedItem = {
				title: updatedTitle,
				description: updatedDesc,
				imageUrl: updatedImageUrl
			};

			let response = await request(app).post(`/items/${createdItem._id}/update`).type("form").send(updatedItem);

			let itemUpdated = await Item.findById(createdItem._id);

			assert.equal(itemUpdated.title, updatedTitle);
			assert.equal(itemUpdated.description, updatedDesc);
			assert.equal(itemUpdated.imageUrl, updatedImageUrl);
		});
		
		it("returns to item after submission", async () => { 
			let createdItem = await seedItemToDatabase();
			let updatedTitle = "Updated Title";
			let updatedDesc = "Updated Desc";
			let updatedImageUrl = "Updated Image Url";

			let updatedItem = {
				title: updatedTitle,
				description: updatedDesc,
				imageUrl: updatedImageUrl
			};

			let response = await request(app).post(`/items/${createdItem._id}/update`).type("form").send(updatedItem);
			
			assert.strictEqual(response.status, 302);
			assert.strictEqual(response.headers.location, `/items/${createdItem._id}`);
		});

		it("displays an error when title is empty", async () => {
			let createdItem = await seedItemToDatabase();
			
			let invalidUpdate = {
				title: "",
				description: "not empty",
				imageUrl: "not empty"
			}
	  
			let response = await request(app).post(`/items/${createdItem._id}/update`).type("form").send(invalidUpdate);
	  
			let dbItem = await Item.findById(createdItem._id);
	  
			assert.equal(dbItem.title, createdItem.title);
			assert.equal(response.status, 400);
			assert.include(parseTextFromHTML(response.text, "form"), "required");
		  });
	  
		  it("displays an error when description is empty", async () => {
			let createdItem = await seedItemToDatabase();
			
			let invalidUpdate = {
				title: "not empty",
				description: "",
				imageUrl: "not empty"
			}
	  
			let response = await request(app).post(`/items/${createdItem._id}/update`).type("form").send(invalidUpdate);
	  
			let dbItem = await Item.findById(createdItem._id);
	  
			assert.equal(dbItem.description, createdItem.description);
			assert.equal(response.status, 400);
			assert.include(parseTextFromHTML(response.text, "form"), "required");
		  });
	  
		  it("displays an error when image url is empty", async () => {
			let createdItem = await seedItemToDatabase();
			
			let invalidUpdate = {
				title: "not empty",
				description: "not empty",
				imageUrl: ""
			}
	  
			let response = await request(app).post(`/items/${createdItem._id}/update`).type("form").send(invalidUpdate);
	  
			let dbItem = await Item.findById(createdItem._id);
	  
			assert.equal(dbItem.imageUrl, createdItem.imageUrl);
			assert.equal(response.status, 400);
			assert.include(parseTextFromHTML(response.text, "form"), "required");
		  });
	});
});