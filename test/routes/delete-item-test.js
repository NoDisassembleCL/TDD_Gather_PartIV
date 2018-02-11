const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
	beforeEach(connectDatabaseAndDropData);
  
	afterEach(diconnectDatabase);

	describe("POST", () => { 
		it("removes item from the database", async () => {
			let createdItem = await seedItemToDatabase();

			let response = await request(app).post(`/items/${createdItem._id}/delete`).type("form");

			let itemMissing = await Item.findById(createdItem._id);

			assert.isNull(itemMissing);
		});
		
		it("returns to root after submission", async () => { 
			let createdItem = await seedItemToDatabase();

			let response = await request(app).post(`/items/${createdItem._id}/delete`).type("form");
			
			assert.strictEqual(response.status, 302);
			assert.strictEqual(response.headers.location, "/");
		});
	});
});