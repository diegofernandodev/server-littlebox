

const express = require('express');
const router = express.Router();
const {getNotificationsByUserIdC,markNotificationAsRead } = require('../controller/notification.Controller');

// Ruta para obtener notificaciones por userId
router.get('/notifications/:userId',getNotificationsByUserIdC);

router.put('/notifications/:notificationId', markNotificationAsRead);


module.exports = router;
