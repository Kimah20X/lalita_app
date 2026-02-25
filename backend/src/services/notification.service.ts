import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import prisma from '../utils/prisma';

const expo = new Expo();

export class NotificationService {
  static async sendToUser(userId: string, title: string, body: string, data?: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { expoPushToken: true }
    });

    if (!user?.expoPushToken || !Expo.isExpoPushToken(user.expoPushToken)) {
      console.log(`User ${userId} has no valid push token`);
      return;
    }

    const messages: ExpoPushMessage[] = [{
      to: user.expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    }];

    try {
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  static async sendToMultiple(userIds: string[], title: string, body: string, data?: any) {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { expoPushToken: true }
    });

    const messages: ExpoPushMessage[] = users
      .filter(u => u.expoPushToken && Expo.isExpoPushToken(u.expoPushToken))
      .map(u => ({
        to: u.expoPushToken!,
        sound: 'default',
        title,
        body,
        data,
      }));

    if (messages.length === 0) return;

    try {
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
    }
  }
}
