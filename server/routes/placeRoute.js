const express = require("express");
const { addPlace, getPlaces, updatePlace, deletePlace } = require("../controllers/placeController");

const router = express.Router();

router.post("/", addPlace);
router.get("/", getPlaces);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;
