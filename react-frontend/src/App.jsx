import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {React,useState} from 'react';
import AskPage from './askpage';
import Homepage from './Homepage';
import QuestionDetail from './questiondetail';



function TopBar() {
  const isLoggedIn = localStorage.getItem("sessionId") !== null;

  return (
    <div className="container-fluid bg-dark text-white py-3 border-bottom border-secondary">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">

        {/* Left Section */}
        <div className="d-flex flex-wrap align-items-center gap-2">

  
                    {isLoggedIn && (

          <Link to="/askpage" className="btn btn-primary">Ask New Question</Link>
          )}
        </div>

        {/* Right Section (Search Bar) */}
      </div>
    </div>
  );
}

function QuestionCard({ title, description, tags = [], username, answers }) {
  return (
    <div className="card bg-dark text-light mb-3 border-secondary">
      <div className="card-body d-flex justify-content-between">
        
        {/* Left content */}
        <div style={{ flex: 1 }}>
          <h5 className="card-title">{title}</h5>

          <div className="mb-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>

          <p className="card-text text-light">{description}</p>
          <small className="text-light">Posted by: {username}</small>
        </div>

        {/* Right content (answers) */}
        <div className="text-end align-self-start">
          <span className="badge bg-info text-light">
            {answers} {answers === 1 ? 'ans' : 'ans'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AskQuestionPage() {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const tags = e.target.tags.value;

    console.log({
      title,
      descriptionMarkdown: description,
      descriptionHtml: marked(description),
      tags
    });
  };

  return (
    <div className="container bg-dark text-light py-5" style={{ minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} className="card bg-secondary text-light p-4 shadow-lg">
        <h2 className="mb-4">Ask a Question</h2>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" placeholder="Your question title..." />
        </div>

        <div className="mb-3">
          <label className="form-label">Description (Markdown supported)</label>
          <textarea
            className="form-control"
            rows={6}
            placeholder="Write your question here using Markdown..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input name="tags" className="form-control" placeholder="e.g. react, css, sql" />
        </div>

        <button className="btn btn-outline-light" type="submit">Submit</button>
      </form>

      {/* Preview */}
      <div className="card bg-dark text-light mt-4 p-3 border-light">
        <h5>Live Preview:</h5>
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: marked(description) }}
        />
      </div>
    </div>
  );
}


function Navbar() {
  const isLoggedIn = localStorage.getItem("sessionId") !== null;
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">STACKIT</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          {!isLoggedIn && (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="d-flex gap-2">
              <Link to="/profile" className="btn btn-outline-light">profile</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const result = await res.text(); // or res.json() if returning JSON
    console.log(result);
    if(res.ok){
      console.log("logged in")
      localStorage.setItem("sessionId", result);

    }
    else{
      alert(result);

    }
  };
  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-start pt-5">
      <div className="card shadow-lg bg-secondary text-light p-4 p-md-5 w-100" style={{ maxWidth: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4">Login</h2>

        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <button className="btn btn-link p-0 text-light">Sign Up</button>
        </p>
      </div>
    </div>
  );
}
function SignUpPage() {
    const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.text(); // or res.json() if Flask returns JSON
    console.log(data);
    alert(data);
  };
  return (


    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-start pt-5">
      <div className="card shadow-lg bg-secondary text-light p-4 p-md-5 w-100" style={{ maxWidth: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4">Sign up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="form-control" placeholder="Choose a username" />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Enter your email" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Create a password" />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="form-control" placeholder="Confirm your password" />
          </div>

          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? {" "} <button className="btn btn-link p-0 text-light">Log in</button>
        </p>
      </div>
    </div>
  );
}





function App() {
  return (
    <>
      <Navbar />
      <TopBar />

    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/askpage" element={<AskPage />} />
      <Route path="/question/:id" element={<QuestionDetail />} />
    </Routes>
    </>
  );
}

export default App;