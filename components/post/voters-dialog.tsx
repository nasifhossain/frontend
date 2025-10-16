"use client"

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CommentUser, commentsApi } from '@/lib/api/comments';
// Use simple inline avatar and spinner markup instead of separate components
import { useToast } from '@/hooks/use-toast';

interface VotersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commentId: string;
  type: number; // 1 = upvoters, -1 = downvoters
}

export function VotersDialog({ open, onOpenChange, commentId, type }: VotersDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<CommentUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const fetch = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await commentsApi.getVoters(commentId, type);
        if (res.success && res.data?.users) {
          if (mounted) setUsers(res.data.users);
        } else {
          throw new Error(res.message || 'Failed to load voters');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load voters';
        setError(msg);
        toast({ variant: 'destructive', title: 'Error', description: msg });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [open, commentId, type, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{type === 1 ? 'Upvoted by' : 'Downvoted by'}</DialogTitle>
          <DialogDescription className="mb-3">Users who {type === 1 ? 'upvoted' : 'downvoted'} this comment</DialogDescription>
        </DialogHeader>

        <div className="min-h-[120px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-gray-600">No users found</div>
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li key={u._id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {u.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-gray-500">{u.username?.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{u.username}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VotersDialog;
