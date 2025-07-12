import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function QuestionDetail() {
      const { id: postId } = useParams(); 
      
      useEffect(() => {
          fetch(`https://odoo-hackathon-stackit.onrender.com/api/answers/${postId}`)
          .then(res => res.json())
          .then(data => setAnswers(data));
        }, [postId]);
        
        const [answers, setAnswers] = useState([]);
        const [newAnswer, setNewAnswer] = useState("");
  const submitAnswer = async () => {
    const res = await fetch("https://odoo-hackathon-stackit.onrender.com/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newAnswer,
        post_id: postId,
        username: localStorage.getItem("username") || "Anonymous"
      })
    });

    if (res.ok) {
      setNewAnswer("");
      const updated = await fetch(`https://odoo-hackathon-stackit.onrender.com/api/answers/${postId}`).then(res => res.json());
      setAnswers(updated);
    }
  };

  return (
    <div className="container my-4">
      <h4>Answers</h4>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          value={newAnswer}
          onChange={e => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
        />
        <button className="btn btn-primary mt-2" onClick={submitAnswer}>
          Submit Answer
        </button>
      </div>

      {answers.length === 0 && <p>No answers yet.</p>}
      {answers.map((a, i) => (
        <div key={i} className="card bg-light text-dark mb-2">
          <div className="card-body">
            <p>{a.content}</p>
            <small>— {a.username} at {new Date(a.timestamp).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}