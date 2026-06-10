import { useEffect, useRef } from 'react';
import * as Notifications   from 'expo-notifications';
import { registerForPushNotifications } from '../services/notifications';

export function useNotifications(onEvent?: (notification: Notifications.Notification) => void) {
  const listenerRef = useRef<Notifications.Subscription | null>(null);
  const onEventRef  = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    void registerForPushNotifications();

    listenerRef.current = Notifications.addNotificationReceivedListener(notification => {
      onEventRef.current?.(notification);
    });

    return () => {
      if (listenerRef.current) {
        Notifications.removeNotificationSubscription(listenerRef.current);
      }
    };
  }, []);
}
