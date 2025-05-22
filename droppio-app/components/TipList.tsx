import { Tip, User } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TipWithUsers extends Tip {
  sender: User;
  receiver: User;
}

interface TipListProps {
  tips: TipWithUsers[];
}

export function TipList({ tips }: TipListProps) {
  return (
    <div className="space-y-4">
      {tips.map((tip) => (
        <Card key={tip.id}>
          <CardHeader>
            <CardTitle className="text-lg">Tip Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${tip.sender.address}.png`} />
                  <AvatarFallback>{tip.sender.name?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{tip.sender.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">sent to</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{tip.receiver.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">received</p>
                </div>
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${tip.receiver.address}.png`} />
                  <AvatarFallback>{tip.receiver.name?.charAt(0) || 'R'}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold">{tip.amount} tokens</p>
              {tip.message && (
                <p className="text-sm text-muted-foreground">"{tip.message}"</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(tip.createdAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 