import { useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useGetBlogPost } from '../hooks/useQueries';
import { setPageTitle, setMetaDescription, setOpenGraphTags } from '../utils/seo';

function formatDate(ts: number | bigint): string {
  const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-invert max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-foreground mt-8 mb-4">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-foreground mt-6 mb-3">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="text-muted-foreground ml-4 mb-1">{line.slice(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-muted-foreground mb-3 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

export default function BlogDetail() {
  const { postId } = useParams({ from: '/blog/$postId' });
  const { data: post, isLoading } = useGetBlogPost(postId);

  useEffect(() => {
    if (post) {
      setPageTitle(`${post.title} - Haircut.com Blog`);
      setMetaDescription(post.excerpt || post.title);
      setOpenGraphTags(post.title, post.excerpt || '', post.coverImageUrl);
    }
  }, [post]);

  const samplePost = {
    id: postId,
    title: 'Top 10 Haircut Trends for 2026',
    excerpt: 'Discover the hottest haircut styles dominating salons across India this year.',
    coverImageUrl: '/assets/generated/blog-cover-default.dim_1200x600.png',
    author: 'Jikesh Kumar',
    publishedAt: Date.now(),
    body: `# Top 10 Haircut Trends for 2026

The world of hair styling is constantly evolving, and 2026 is no exception. From bold statement cuts to subtle texture plays, Indian salons are embracing a diverse range of styles.

## 1. The Textured Crop

The textured crop continues to dominate men's styling. This versatile cut works for all hair types and requires minimal maintenance.

## 2. The Modern Bob

The classic bob gets a contemporary update with asymmetric cuts and bold color blocking.

## 3. Curtain Bangs

Curtain bangs have made a massive comeback, framing the face beautifully for all face shapes.

## Tips for Choosing Your Style

- Consider your face shape
- Think about your lifestyle and maintenance routine
- Consult with a professional stylist
- Look at reference photos before your appointment

Visit Haircut.com to find the best salons near you and book your appointment today!`,
  };

  const displayPost = post || (postId.startsWith('sample') ? samplePost : null);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-gold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {displayPost.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80">
            <img
              src={displayPost.coverImageUrl}
              alt={displayPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{displayPost.title}</h1>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {displayPost.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(displayPost.publishedAt)}
          </span>
        </div>

        <SimpleMarkdown content={displayPost.body} />
      </div>
    </div>
  );
}
