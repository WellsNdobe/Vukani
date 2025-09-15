//These are routes for handling messages in the application
import express from 'express';
import auth from '../middleware/auth.js';
import { sendMessage, getMessagesBetweenUsers } from '../controllers/messages.js';
const router = express.Router();

router.post('/send', auth, sendMessage);
router.get('/between/:userId1/:userId2', auth, getMessagesBetweenUsers);