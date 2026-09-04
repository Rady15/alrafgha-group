import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { formatDate } from '../i18n/format';
import { BookOpen, Calendar, Eye, User, ArrowUpRight, Tag } from 'lucide-react';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.publishedPosts);
                const data = await response.json();

                if (data.status === 'success') {
                    setPosts(data.data.posts || []);
                } else {
                    setError('Failed to load posts');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-base text-ink-600 font-medium tracking-wider uppercase">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <h3 className="font-display text-4xl font-bold text-ink-900 mb-3">Something went wrong</h3>
                    <p className="text-ink-600 mb-8 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#fafaf7] pt-20 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <BookOpen className="w-3.5 h-3.5" />
                        مدونة العرفجة
                    </div>
                    <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] tracking-tight mb-4">
                        المدونة
                        <em className="not-italic text-primary-500"> / Blog</em>
                    </h1>
                    <p className="text-ink-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        أحدث المقالات والأخبار عن عالم تأجير السيارات
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            to={`/blog/${post.slug}`}
                            key={post._id}
                            className="group relative bg-white rounded-[32px] border border-ink-100 hover:border-primary-200 transition-all duration-500 shadow-card hover:shadow-card-hover overflow-hidden transform hover:-translate-y-2"
                        >
                            {post.featured_image && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {post.category && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ink-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {post.category}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="font-display text-xl font-bold text-ink-900 mb-2 group-hover:text-primary-500 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-ink-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                                <div className="flex items-center justify-between text-xs text-ink-500">
                                    <div className="flex items-center gap-3">
                                        {post.published_at && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(post.published_at)}</span>
                                            </div>
                                        )}
                                        {post.views != null && (
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{post.views}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {post.author && (
                                    <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-ink-400" />
                                        <span className="text-xs text-ink-500">{post.author}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-card border border-ink-100 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-ink-50 rounded-full mb-6 border border-ink-100">
                            <BookOpen className="w-8 h-8 text-ink-400" />
                        </div>
                        <h3 className="font-display text-3xl font-bold text-ink-900 mb-3">No Posts Yet</h3>
                        <p className="text-ink-500 text-lg">لا توجد مقالات حالياً. ترقبوا جديدنا قريباً</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
