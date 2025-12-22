import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter email");
      return;
    }

    const success = login(email);

    if (!success) {
      alert("User not found. Please sign up first.");
      return;
    }

    navigate("/dashboard");
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-title">MediCare+</div>
      <div className="auth-subtitle">
        Smart medicine reminders made simple
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Login</button>
        <p style={{ marginTop: "14px", textAlign: "center", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  </div>
);

}

export default Login;
