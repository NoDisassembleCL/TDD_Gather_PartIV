const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe("GET", () => { 
    it("renders empty input fields", async () => { 
      let response = await request(app).get("/items/create");
      
      assert.include(parseTextFromHTML(response.text, "input#title-input"), "");
      assert.include(parseTextFromHTML(response.text, "input#imageUrl-input"), "");
      assert.include(parseTextFromHTML(response.text, "textarea#description-input"), "");
    });
  });

  describe("POST", () => {
    it("saves to database and renders submission", async () => { 
      let itemToCreate = buildItemObject();

      let response = await request(app).post("/items/create").type("form").send(itemToCreate);

      let createdItem = await Item.findOne(itemToCreate);

      assert.isNotNull(createdItem, "Item should not be null.");
    });

    it("returns to root after submission", async () => { 
      let itemToCeate = buildItemObject();

      let response = await request(app).post("/items/create").type("form").send(itemToCreate);
      
      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, "/");
    });

    it("displays an error when title is empty", async () => {
      let invalidItemToCreate = {
        description: 'test',
        imageUrl: 'https://www.placebear.com/200/300',
      };

      let response = await request(app).post("/items/create").type("form").send(invalidItemToCreate);

      let createdItem = await Item.find({});

      assert.equal(createdItem.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });

    it("displays an error when description is empty", async () => {
      let invalidItemToCreate = {
        title: 'description is empty',
        imageUrl: 'https://www.placebear.com/200/300',
      };

      let response = await request(app).post("/items/create").type("form").send(invalidItemToCreate);

      let createdItem = await Item.find({});

      assert.equal(createdItem.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });

    it("displays an error when image url is empty", async () => {
      let invalidItemToCreate = {
        title: 'image url is empty',
        description: 'what did I just say?',
      };

      let response = await request(app).post("/items/create").type("form").send(invalidItemToCreate);

      let createdItem = await Item.find({});

      assert.equal(createdItem.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, "form"), "required");
    });
   });
});
