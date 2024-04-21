const mongoose = require('mongoose');
const {model, Schema} = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rol: String,
  tenantId: String,
  message: String,
  url: String,
  read: { type: Boolean, default: false }
});


module.exports = model('Notification', notificationSchema, 'Notifications');;
