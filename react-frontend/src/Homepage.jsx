import { useState, useEffect } from 'react';

function QuestionCard({ title, description, tags, username, answers = 0 }) {
  return (
    <div className="card bg-dark text-light mb-3 border-secondary">
      <div className="card-body d-flex justify-content-between">
        <div>
          <h5>{title}</h5>
          <div className="mb-2">
            {tags.split(',').map((tag, i) => (
              <span key={i} className="badge bg-secondary me-1">{tag.trim()}</span>
            ))}
          </div>
          <p>{description}</p>
          <small>Posted by: {username || 'Anonymous'}</small>
        </div>
        <div>
          <span className="badge bg-info">{answers} ans</span>
        </div>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5001/api/questions?page=${page}&per_page=5`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setPages(data.pages);
      });
  }, [page]);

  return (
    <div className="container py-4">
      {questions.map((q, i) => (
        <QuestionCard key={i} {...q} />
      ))}

      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: pages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}