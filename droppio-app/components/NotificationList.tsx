import { Notification } from '@prisma/client';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Link href={notification.link || '#'} key={notification.id}>
          <Card className={`transition-colors hover:bg-muted/50 ${notification.read ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{notification.type}</Badge>
                    {!notification.read && (
                      <Badge variant="default" className="bg-blue-500">New</Badge>
                    )}
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 