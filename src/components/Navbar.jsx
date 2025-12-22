import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        MediCare+
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "12px", fontSize: "14px" }}>
            {user.email}
          </span>
          <button
  className="btn btn-secondary"
  onClick={() => navigate("/analytics")}
  style={{ marginRight: "10px" }}
>
  📊 Analytics
</button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{
              padding: "6px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
