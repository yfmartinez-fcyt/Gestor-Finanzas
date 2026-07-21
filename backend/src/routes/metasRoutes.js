const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllMetas,
  getMetaById,
  createMeta,
  updateMeta,
  deleteMeta,
} = require("../controllers/metasController");

router.use(authMiddleware);

router
  .route("/")
  .get(getAllMetas)
  .post(createMeta);

router
  .route("/:id")
  .get(getMetaById)
  .put(updateMeta)
  .delete(deleteMeta);

module.exports = router;