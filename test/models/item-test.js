const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe("#title", () => { 
    it("should be a String", () => {
      let titleAsInt = 1;
      let createdItem = new Item ({
        title: titleAsInt
      });

      assert.strictEqual(createdItem.title, titleAsInt.toString());
    });
    
    it("is a required field", () => { 
      let createdItem = new Item({});

      createdItem.validateSync();

      assert.strictEqual(createdItem.errors.title.message, "Path `title` is required.");
    });
  });

  describe("#description", () => { 
    it("should be a String", () => {
      let descAsInt = 1;
      let createdItem = new Item ({
        description: descAsInt
      });

      assert.strictEqual(createdItem.description, descAsInt.toString());
    });
    
    it("is a required field", () => { 
      let createdItem = new Item({});

      createdItem.validateSync();

      assert.strictEqual(createdItem.errors.description.message, "Path `description` is required.");
    });
  });

  describe("#imageUrl", () => { 
    it("should be a String", () => {
      let imageUrlAsInt = 1;
      let createdItem = new Item ({
        imageUrl: imageUrlAsInt
      });

      assert.strictEqual(createdItem.imageUrl, imageUrlAsInt.toString());
    });
    
    it("is a required field", () => { 
      let createdItem = new Item({});

      createdItem.validateSync();

      assert.strictEqual(createdItem.errors.imageUrl.message, "Path `imageUrl` is required.");
    });
  });
});
