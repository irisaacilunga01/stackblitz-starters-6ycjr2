const express = require('express');
const { Group, User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const group = await Group.create({ name: req.body.name });
    await group.addUser(req.user.id);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du groupe' });
  }
});

router.post('/:groupId/users', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.groupId);
    const user = await User.findByPk(req.body.userId);
    
    if (group && user) {
      await group.addUser(user);
      res.status(200).json({ message: 'Utilisateur ajouté au groupe' });
    } else {
      res.status(404).json({ message: 'Groupe ou utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur au groupe' });
  }
});

module.exports = router;