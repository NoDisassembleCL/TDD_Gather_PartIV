const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe("GET", () => { 
    it("displays correct item", async () => { 
      let createdItem = await seedItemToDatabase();

      let response = await request(app).get(`/items/${createdItem._id}`);

      assert.strictEqual(response.status, 200);
      assert.include(parseTextFromHTML(response.text, "#item-title"), createdItem.title);
      assert.include(parseTextFromHTML(response.text, "#item-description"), createdItem.description);
    });

    it("displays correct image", async () => { 
      let createdItem = await seedItemToDatabase();

      let response = await request(app).get(`/items/${createdItem._id}`);

      assert.strictEqual(response.status, 200);
      const imageElement = findImageElementBySource(response.text, createdItem.imageUrl);
      assert.equal(imageElement.src, createdItem.imageUrl);
    });
  });
});
