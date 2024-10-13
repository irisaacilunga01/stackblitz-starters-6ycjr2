const express = require('express');
const { Message, User, Group } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, recipientId, groupId } = req.body;
    const message = await Message.create({
      content,
      UserId: req.user.id,
      GroupId: groupId
    });

    if (recipientId) {
      const recipient = await User.findByPk(recipientId);
      if (recipient) {
        await message.setUser(recipient);
      }
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'envoi du message' });
  }
});

router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.messageId);
    if (message) {
      message.isRead = true;
      await message.save();
      res.status(200).json({ message: 'Message marqué comme lu' });
    } else {
      res.status(404).json({ message: 'Message non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du statut du message' });
  }
});

module.exports = router;