import { User } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user.address}.png`} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle>{user.name || 'Anonymous'}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.address.slice(0, 6)}...{user.address.slice(-4)}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">{user.bio || 'No bio yet'}</p>
              <div className="flex gap-2">
                <Badge variant={user.isCreator ? "default" : "secondary"}>
                  {user.isCreator ? 'Creator' : 'User'}
                </Badge>
                <Badge variant="outline">
                  {user.eligibilityLevel || 'none'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Balance: {user.balance || '0'}</p>
                <p>Total Tipped: {user.totalTipped || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 