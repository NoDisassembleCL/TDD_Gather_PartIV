const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

// Add additional routes below:
router.get("/items/create", async (req, res, next) => {
  res.render("create");
});
 
router.post("/items/create", async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let imageUrl = req.body.imageUrl;

  let createdItem = new Item({
    title: title,
    description: description,
    imageUrl, imageUrl
  });

  createdItem.validateSync();

  if (createdItem.errors) {
    res.status( 400 ).render( "create", { newItem: createdItem } );
  }
  else {
    await Item.create(createdItem);
    res.redirect("/");
  }
});
 
router.get("/items/:itemId", async (req, res) => {
  let itemToDisplay = await Item.findById(req.params.itemId);

  res.render("item", { newItem: itemToDisplay });
});
 
router.post("/items/:itemId/delete", async (req, res) => { 
  await Item.findByIdAndRemove(req.params.itemId);

  res.redirect("/");
});

router.get("/items/:itemId/update", async (req, res) => {
  let itemToUpdate = await Item.findById(req.params.itemId);

  res.render("update", { newItem: itemToUpdate });
});

router.post("/items/:itemId/update", async (req, res) => {
  let newTitle = req.body.title;
  let newDescription = req.body.description;
  let newImageUrl = req.body.imageUrl;

  let updatedItem = new Item({
    title: newTitle,
    description: newDescription,
    imageUrl: newImageUrl
  });

  updatedItem.validateSync();

  if (updatedItem.errors) {
    res.status(400).render("update", { newItem: updatedItem });
  }
  else {
    await Item.findByIdAndUpdate(req.params.itemId, {
      title: newTitle,
      description: newDescription,
      imageUrl: newImageUrl
    }, () => {
      res.redirect(`/items/${req.params.itemId}`);
    });
  }
});

module.exports = router;
