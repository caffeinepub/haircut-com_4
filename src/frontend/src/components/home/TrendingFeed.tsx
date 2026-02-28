import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Heart, MessageCircle } from 'lucide-react';
import { useSocialFeed } from '../../hooks/useQueries';
import { SkeletonLoader } from '../common/SkeletonLoader';

export function TrendingFeed() {
  const { data: posts, isLoading } = useSocialFeed();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkeletonLoader variant="post-card" count={2} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts?.slice(0, 4).map(post => (
        <button
          key={post.id}
          onClick={() => navigate({ to: '/feed' })}
          className="group text-left rounded-2xl overflow-hidden bg-card border border-border card-hover shadow-card"
        >
          {post.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-white" />{post.likeCount}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.commentCount}</span>
              </div>
            </div>
          )}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-gold-200 overflow-hidden flex-shrink-0">
                {post.authorPhoto && <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />}
              </div>
              <span className="text-xs font-semibold text-foreground">{post.authorName}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
