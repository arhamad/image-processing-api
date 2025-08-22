import { Router } from "express";
import { getImage } from "../controllers/imageController";

const router = Router();

router.get("/", getImage); // /images?filename=fjord&width=200&height=200

export default router;
