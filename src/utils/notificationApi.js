import { apiRequest } from './api';

// Get user notifications
export async function getNotifications() {
  return await apiRequest('/notifications');
}

// Mark notification as read
export async function markNotificationAsRead(id) {
  return await apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH'
  });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  return await apiRequest('/notifications/read-all', {
    method: 'PATCH'
  });
}

// Delete notification
export async function deleteNotification(id) {
  return await apiRequest(`/notifications/${id}`, {
    method: 'DELETE'
  });
}

// Get email preferences
export async function getEmailPreferences() {
  return await apiRequest('/users/email-preferences');
}

// Update email preferences
export async function updateEmailPreferences(preferences) {
  return await apiRequest('/users/email-preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences)
  });
}

// Admin: Send broadcast notification
export async function sendBroadcastNotification(data) {
  return await apiRequest('/admin/email/broadcast', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Admin: Send notification to specific users
export async function sendNotificationToUsers(data) {
  return await apiRequest('/admin/notifications/send', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Admin: Get notification statistics
export async function getNotificationStats() {
  return await apiRequest('/admin/notifications/stats');
}