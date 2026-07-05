import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/posts', form);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Failed to create post';
      setError(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Post</h1>
      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <textarea
          placeholder="Write your content here..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows="12"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
