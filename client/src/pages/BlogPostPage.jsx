import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../i18n/format';
import { ArrowLeft, Calendar, Eye, User, Tag, BookOpen } from 'lucide-react';

const BlogPostPage = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.blogBySlug(slug));
                const data = await response.json();

                if (data.status === 'success') {
                    setPost(data.data.post);
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-base text-ink-600 font-medium tracking-wider uppercase">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ink-50 rounded-full mb-6 border border-ink-100">
                        <BookOpen className="w-8 h-8 text-ink-400" />
                    </div>
                    <h3 className="font-display text-4xl font-bold text-ink-900 mb-3">404</h3>
                    <p className="text-ink-600 mb-8 text-lg">
                        {error || 'المقال غير موجود'}
                    </p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] overflow-hidden">
            {/* Hero Image */}
            {post.featured_image && (
                <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                        <div className="max-w-4xl mx-auto">
                            {post.category && (
                                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                                    <Tag className="w-3 h-3" />
                                    {post.category}
                                </div>
                            )}
                            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back button */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-ink-600 hover:text-primary-500 font-medium mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للمدونة
                </Link>

                {/* Post meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-ink-500 mb-8 pb-8 border-b border-ink-100">
                    {post.published_at && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                    )}
                    {post.views != null && (
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} مشاهدة</span>
                        </div>
                    )}
                    {post.author && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                        </div>
                    )}
                </div>

                {/* Title if no hero image */}
                {!post.featured_image && (
                    <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-tight mb-8">
                        {post.title}
                    </h1>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none text-ink-700 leading-relaxed">
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                        <p className="text-ink-500">{post.excerpt}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
