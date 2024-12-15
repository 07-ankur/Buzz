import { Router } from "express";
import { addMessage, getMessages, addImageMessage, addAudioMessage, getInitialContactswithMessages } from "../controllers/MessageController.js";

const router = Router();

import upload from "../utils/multer.js";
router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", upload.single("image"), addImageMessage);
router.post("/add-audio-message", upload.single("audio"), addAudioMessage);
router.get("/get-initial-contacts/:from", getInitialContactswithMessages);

export default router;