import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/comments/${id}`, {
        text: commentText,
      });
      setPost((prev) => ({
        ...prev,
        comments: [data, ...(prev.comments || [])],
      }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${id}/${commentId}`);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <article className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>By {post.author?.username || 'Unknown'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </p>
        {isAuthor && (
          <div className="flex gap-3 border-t pt-4">
            <Link
              to={`/edit/${post._id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </article>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Comments ({post.comments?.length || 0})
        </h2>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </form>
        )}

        {!post.comments || post.comments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No comments yet. {user ? 'Be the first!' : 'Login to comment.'}
          </p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {comment.author?.username || 'Unknown'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {user && comment.author?._id === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetail;
