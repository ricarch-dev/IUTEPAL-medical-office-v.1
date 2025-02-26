import { useEffect, useState } from 'react';
import { BellIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

interface Notification {
  id: string;
  id_event: string;
  is_read: boolean;
  created_at: string;
  event: {
    title: string;
    description: string;
  };
}

export default function IconNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notificaciones');
        const data = await response.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          setHasNewNotification(data.notifications.some((notification: Notification) => !notification.is_read));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const markAsRead = async (id: string, is_read: boolean) => {
    try {
      await fetch('/api/notificaciones', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, is_read }),
      });
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, is_read } : notification
      ));
      setHasNewNotification(notifications.some(notification => !notification.is_read));
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notificaciones', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
      setHasNewNotification(false);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="-m-2.5 p-2.5 relative">
          <h3 className="sr-only">Ver Notificaciones</h3>
          <BellIcon className="hover:text-quartary h-6 w-6 text-black transition-all duration-100" aria-hidden="true" />
          {hasNewNotification && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium leading-none">Notificaciones</h4>
              <Button variant="link" className="text-sm text-blue-600" onClick={() => markAllAsRead()}>Marcar todas como leídas</Button>
            </div>
            <h5>Eventos</h5>
            {loading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={`flex items-center space-x-3 p-2 ${!notification.is_read ? 'bg-sky-100 rounded-md' : ''}`}>
                  <Input
                    type="checkbox"
                    className="size-3"
                    checked={notification.is_read}
                    onChange={() => markAsRead(notification.id, !notification.is_read)}
                  />
                  <div>
                    <h2 className="text-md font-semibold">{notification.event.title}</h2>
                    <p className="text-sm text-muted-foreground">{notification.event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tienes notificaciones pendientes.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}