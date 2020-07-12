const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Offer = require("../models/Offer");
const User = require("../models/User");

const isAuthenticated = require("../middlewares/isAuthenticated");

cloudinary.config({
  cloud_name: "dsfaoz5wl",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files.picture.path);
    const result = await cloudinary.uploader.upload(req.files.picture.path);
    // console.log(result);

    // Création de la nouvelle annonce

    const newOffer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      picture: result,
      creator: req.user,
      created: new Date(),
    });

    await newOffer.save();
    res.json({
      _id: newOffer._id,
      title: newOffer.title,
      description: newOffer.description,
      price: newOffer.price,
      created: newOffer.created,
      creator: {
        account: newOffer.creator.account,
        _id: newOffer.creator._id,
      },
      picture: newOffer.picture,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// router.get("/offer/with-count", async (req, res) => {
//   try {http://localhost:3000/offer/with-count?page=1

//     //   const offers = await Offer.find({
//     //     price: {
//     //       $gte: 100, // req.query.priceMin
//     //       $lte: 700, // req.query.priceMax
//     //     },
//     //   }).select("title price");

//     //   const offers = await Offer.find({ title: new RegExp("PlayStation", "i") }); // i = insensitive
//     //   const offers = await Offer.find().sort({ price: "desc" });

//     //   const offers = await Offer.find({
//     //     title: new RegExp("PlayStation", "i"),
//     //   }).sort({ price: "asc" });
//     res.json({ message: "/offer/withcount" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

router.get("/offer/with-count", async (req, res) => {
  try {
    const filter = {};

    // ?title=playstation
    if (req.query.title) {
      console.log(req.query.title);
      filter.title = new RegExp(req.query.title, "i");
    }

    // ?priceMax=250
    if (req.query.price === "priceMax") {
      // console.log(req.query.priceMax);
      filter.price = {
        $gte: req.query.priceMax,
      };
    }

    // ?priceMin=200
    if (req.query.price === "priceMin") {
      // console.log(req.query.priceMin);
      filter.price = {
        $lte: req.query.priceMin,
      };
    }
    // ?priceMin=200&priceMax=500
    if (req.query.price === "priceMin" && "priceMax") {
      console.log(req.query.price);
      filter.price = {
        $let: req.query.priceMin,
        $gte: req.query.priceMax,
      };
    }
    let sort = {};
    if (req.query.sort === "date-desc") {
      //?sort=date-desc
      sort = { created: "desc" };
    } else if (req.query.sort === "date-asc") {
      //with-count?sort=date-asc
      sort = { created: "asc" };
    } else if (req.query.sort === "price-desc") {
      //with-count?sort=price-desc => Offer.find().sort({ price: "desc" });
      sort = { price: "desc" };
    } else if (req.query.sort === "price-asc") {
      //with-count?sort=price-asc => Offer.find().sort({ price: "asc" });
      sort = { price: "asc" };
    }

    console.log(req.query);
    res.json(req.query);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/offer/playstation", async (req, res) => {
  try {
    const offers = await Offer.find({ title: new RegExp("PlayStation", "i") }); // i = insensitive")
    res.json(offers);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    //:id = params.id
    console.log(req.params.id);
    const searchById = await Offer.findById(req.params.id);
    console.log(searchById);

    res.json(searchById);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/offer/user/:id", async (req, res) => {
  try {
    //:id = params.id
    // console.log(req.params.id);
    const searchOfferByUser = await Offer.find(req.params.id);
    console.log(searchOfferByUser);

    res.json(searchOfferByUser);
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
