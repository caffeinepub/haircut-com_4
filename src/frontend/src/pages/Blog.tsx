import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { useListBlogPosts } from '../hooks/useQueries';
import { setPageTitle, setMetaDescription, setOpenGraphTags } from '../utils/seo';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  author: string;
  publishedAt: number | bigint;
}

function formatDate(ts: number | bigint): string {
  const ms = typeof ts === 'bigint' ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();

  useEffect(() => {
    setPageTitle('Blog - Haircut.com');
    setMetaDescription('Read expert tips, salon trends, and beauty insights from the Haircut.com team.');
    setOpenGraphTags('Blog - Haircut.com', 'Read expert tips, salon trends, and beauty insights from the Haircut.com team.');
  }, []);

  const samplePosts: BlogPost[] = [
    {
      id: 'sample-1',
      title: 'Top 10 Haircut Trends for 2026',
      excerpt: 'Discover the hottest haircut styles dominating salons across India this year, from textured crops to bold bobs.',
      coverImageUrl: '/assets/generated/blog-cover-default.dim_1200x600.png',
      author: 'Jikesh Kumar',
      publishedAt: Date.now(),
    },
    {
      id: 'sample-2',
      title: 'How to Choose the Right Salon for Your Hair Type',
      excerpt: 'Not all salons are created equal. Learn how to find the perfect salon that specializes in your unique hair texture and needs.',
      coverImageUrl: '/assets/generated/blog-cover-default.dim_1200x600.png',
      author: 'Haircut.com Team',
      publishedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'sample-3',
      title: 'The Rise of Unisex Salons in Urban India',
      excerpt: "Unisex salons are transforming the grooming landscape in Indian cities. Here's why they're becoming the preferred choice.",
      coverImageUrl: '/assets/generated/blog-cover-default.dim_1200x600.png',
      author: 'Haircut.com Team',
      publishedAt: Date.now() - 86400000 * 7,
    },
  ];

  const displayPosts: BlogPost[] = (posts && posts.length > 0) ? posts : samplePosts;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">Our Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Beauty & Style <span className="text-gold">Insights</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert tips, salon trends, and grooming guides from the Haircut.com team.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$postId"
                params={{ postId: post.id }}
                className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.coverImageUrl || '/assets/generated/blog-cover-default.dim_1200x600.png'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
