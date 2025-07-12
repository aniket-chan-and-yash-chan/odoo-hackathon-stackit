import { useState } from 'react';

export default function AskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5001/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, tags })
    });

    if (response.ok) {
      alert('Question posted successfully!');
      setTitle('');
      setDescription('');
      setTags('');
    } else {
      alert('Failed to post question.');
    }
  };

  return (
    <div className="container py-5 bg-dark text-light">
      <h2 className="mb-4">Ask a Question</h2>
      <form className="card bg-secondary p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags (comma separated)</label>
          <input className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}