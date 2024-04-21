
const { getNotificationsByUserId } = require('../services/notificationService');
const Notification = require('../models/notification.Model');

const controller = {};

// Obtener notificaciones por userId 
controller.getNotificationsByUserIdC = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await getNotificationsByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


controller.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);
    res.sendStatus(500);
  }
};




module.exports = controller; 

