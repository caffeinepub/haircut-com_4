import React, { useState } from 'react';
import { useSocialFeed, useLikePost, useCreatePost, usePostComments, useAddComment } from '../hooks/useQueries';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, Plus, Send, Loader2, Hash } from 'lucide-react';
import { Post } from '../types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function SocialFeed() {
  const { data: posts, isLoading } = useSocialFeed();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Create Post</DialogTitle></DialogHeader>
            <CreatePostForm onClose={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-6"><SkeletonLoader variant="post-card" count={3} /></div>
      ) : (
        <div className="space-y-6">
          {posts?.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const likePost = useLikePost();
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    likePost.mutate({ postId: post.id, isLiked: !post.isLiked });
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/20 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-gold-600">
          {post.authorPhoto ? <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" /> : post.authorName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{post.authorName}</p>
          <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>
      {post.imageUrl && (
        <div className="relative aspect-square overflow-hidden">
          <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors', post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400')}>
            <Heart className={cn('w-5 h-5', post.isLiked ? 'fill-red-500' : '')} />
            {post.likeCount}
          </button>
          <button onClick={() => setShowComments(v => !v)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
            {post.commentCount}
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.authorName}</span>{' '}
          {post.caption}
        </p>
        {post.hashtags.length > 0 && (
          <p className="text-xs text-gold-500">{post.hashtags.join(' ')}</p>
        )}
        {showComments && <CommentThread postId={post.id} />}
      </div>
    </div>
  );
}

function CommentThread({ postId }: { postId: string }) {
  const { data: comments, isLoading } = usePostComments(postId);
  const addComment = useAddComment();
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment.mutateAsync({ postId, text });
    setText('');
  };

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      {isLoading ? <SkeletonLoader variant="text" count={2} /> : (
        <div className="space-y-2">
          {comments?.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">{c.authorName.charAt(0)}</div>
              <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-foreground">{c.authorName}</p>
                <p className="text-xs text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="h-9 rounded-xl text-sm flex-1" />
        <Button type="submit" size="sm" disabled={!text.trim() || addComment.isPending} className="btn-gold rounded-xl h-9 w-9 p-0">
          {addComment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}

function CreatePostForm({ onClose }: { onClose: () => void }) {
  const createPost = useCreatePost();
  const [caption, setCaption] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    const hashtags = hashtagInput.split(' ').filter(h => h.startsWith('#'));
    await createPost.mutateAsync({ caption, hashtags, imageUrl: imageUrl || undefined });
    toast.success('Post created!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="rounded-xl" />
      </div>
      <Textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..." className="rounded-xl min-h-[100px]" />
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={hashtagInput} onChange={e => setHashtagInput(e.target.value)} placeholder="#haircut #salon #style" className="pl-9 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
        <Button type="submit" disabled={!caption.trim() || createPost.isPending} className="btn-gold flex-1 rounded-xl gap-2">
          {createPost.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Post
        </Button>
      </div>
    </form>
  );
}
