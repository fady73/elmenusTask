const express = require("express");
const cors = require("cors");

const PORT = 5000;
const app = express();
const { v4: uuidv4 } = require("uuid");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000",
};

const menusList = {
  categories: [
    {
      id: 80877,
      name: "Appetizers",
      items: [
        {
          id: 132548,
          name: "French Fries",
          description:
            "Custom premium cut by farm frites. Add melted cheese for 7LE - chili con carne for 9LE",
          price: 54.834,
        },
        {
          id: 655881,
          name: "Nacho Chips & Salsa",
          description:
            "Homemade crispy nacho chips served with fresh salsa dip",
          price: 54.834,
        },
        {
          id: 655882,
          name: "Sweet Potato Fries",
          description: "Served with hot mayo dip",
          price: 54.834,
        },
        {
          id: 655883,
          name: "Seasoned Wedges",
          description: "Served with garlic mayo dip",
          price: 54.834,
        },
        {
          id: 132565,
          name: "Chili Cheese Fries",
          description:
            "French fries, topped with chili con carne & melted cheddar cheese, served with sour cream and pickled jalapenos",
          price: 54.834,
        },
        {
          id: 655884,
          name: "Potato Skins",
          description:
            "Loaded with cheese & chili beef ( served with sour cream)",
          price: 54.834,
        },
        {
          id: 132549,
          name: "Onion Rings",
          description: "",
          price: 54.834,
        },
      ],
    },
    {
      id: 21281,
      name: "Salads",
      items: [
        {
          id: 655880,
          name: "BLT Salad",
          description: "Grilled bacon , lettuce , tomatoes with ranch sauce",
          price: 34.834,
        },
        {
          id: 132570,
          name: "Caesar Salad",
          description: "Lettuce, Parmesan cheese, Croutons & Caesar dressing",
          price: 34.834,
        },
        {
          id: 132574,
          name: "Garden Salad",
          description:
            "Mixed greens and fresh garden selections tossed in vinaigrette dressing",
          price: 34.834,
        },
        {
          id: 164438,
          name: "Rocket Mushroom Salad",
          description:
            "Rocket leaves, fresh mushrooms, Parmesan cheese, Balsamic dressing",
          price: 34.834,
        },
      ],
    },
  ],
};

// This function runs if the http://localhost:5000/getData endpoint
// is requested with a GET request
app.get("/getData", cors(corsOptions), (req, res) => {
  res.json(menusList);
});

const ValidateCatgeory = (catgeory) => {
  let message = "";
  if (!catgeory.name) {
    message = "Category name not found";
  }

  if (!catgeory.description) {
    message = "Category description not found";
  }

  return message;
};

const ValidateItem = (item) => {
  let message = "";
  if (!item.name) {
    message = "item name not found";
  }
  if (!item.price) {
    message = "item price not found";
  }
  if (!item.description) {
    message = "item description not found";
  }

  return message;
};

app.post("/category", (req, res) => {
  let catgeory = { ...req.body, items: [], id: uuidv4() };
  let isValid = ValidateCatgeory(catgeory);
  if (isValid == "") {
    menusList.categories.push(catgeory);
    res.status(201).send(catgeory);
  } else {
    res.statusMessage = isValid;
    res.sendStatus(404);
  }
});

app.delete("/category/:Id", (req, res) => {
  let catgeoryId = req.params.Id;
  let currentcatgeory = menusList.categories.filter((x) => x.id == catgeoryId);
  if (currentcatgeory) {
    menusList.categories = menusList.categories.filter(
      (x) => x.id != catgeoryId
    );
    res.status(200).send("catgeory deleted sucessfully.");
  } else {
    res.statusMessage = "catgeory does not exist";
    res.sendStatus(404);
  }
});

app.put("/category/:Id", (req, res) => {
  let catgeoryId = req.params.Id;
  let catgeory = req.body;
  let currentcatgeory = menusList.categories.filter(
    (x) => x.id == catgeoryId
  )[0];
  if (currentcatgeory) {
    let isValid = ValidateCatgeory(catgeory);
    if (isValid == "") {
      currentcatgeory.name = catgeory.name;
      currentcatgeory.description = catgeory.description;
      currentcatgeory.items = catgeory.items;
      res.status(200).send("catgeory updated sucessfully.");
    } else {
      res.statusMessage = isValid;
      res.sendStatus(400);
    }
  } else {
    res.statusMessage = "catgeory does not exist";
    res.sendStatus(404);
  }
});

app.post("/category/:Id/addItem", (req, res) => {
  let item = { ...req.body, id: uuidv4() };
  let catgeoryId = req.params.Id;
  let isValid = ValidateItem(item);
  if (isValid == "") {
    let currentcatgeory = menusList.categories.filter(
      (x) => x.id == catgeoryId
    )[0];
    currentcatgeory.items.push(item);
    res.status(201).send("item added sucessfully.");
  } else {
    res.statusMessage = isValid;
    res.sendStatus(404);
  }
});

app.delete("/category/:Id/:itemId", (req, res) => {
  let catgeoryId = req.params.Id;
  let itemId = req.params.itemId;
  let currentcatgeoryId = menusList.categories.findIndex(
    (x) => x.id == catgeoryId
  );
  let currentItem = menusList.categories[currentcatgeoryId].items.filter(
    (x) => x.id == itemId
  );
  if (currentItem) {
    menusList.categories[currentcatgeoryId].items = menusList.categories[
      currentcatgeoryId
    ].items.filter((x) => x.id != itemId);
    res.status(200).send("item deleted sucessfully.");
  } else {
    res.statusMessage = "item does not exist";
    res.sendStatus(404);
  }
});

app.put("/category/:Id/:itemId", (req, res) => {
  let catgeoryId = req.params.Id;
  let itemId = req.params.itemId;
  let currentcatgeoryId = menusList.categories.findIndex(
    (x) => x.id == catgeoryId
  );
  let currentItemId = menusList.categories[currentcatgeoryId].items.findIndex(
    (x) => x.id == itemId
  );
  let currentItem =
    menusList.categories[currentcatgeoryId].items[currentItemId];
  let editItem = req.body;
  if (currentItem) {
    let isValid = ValidateItem(editItem);
    if (isValid == "") {
      currentItem.name = editItem.name;
      currentItem.description = editItem.description;
      currentItem.price = editItem.price;
      res.status(200).send("item updated sucessfully.");
    } else {
      res.statusMessage = isValid;
      res.sendStatus(400);
    }
  } else {
    res.statusMessage = "item does not exist";
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
