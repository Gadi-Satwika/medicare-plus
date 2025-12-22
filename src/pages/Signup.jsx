import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { user, signup, loading } = useAuth();
  const [email, setEmail] = useState("");
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

    const success = signup(email);

    if (!success) {
      alert("User already exists. Please login.");
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
          Create your account to manage medicines
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Sign Up</button>
          <p style={{ marginTop: "14px", textAlign: "center", fontSize: "14px" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
