import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMedicines } from "../context/MedicineContext";
import Navbar from "../components/Navbar";

function Dashboard() {
  const { user, loading } = useAuth();

  const {
    medicines,
    addMedicine,
    toggleTaken,
    deleteMedicine,
    updateMedicine,
  } = useMedicines();

  

  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeReminder, setActiveReminder] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTime, setEditTime] = useState("");


  const [name, setName] = useState("");
  const [time, setTime] = useState("");


  useEffect(() => {
    const now = new Date();

    const dueMedicine = medicines.find((med) => {
      if (med.takenToday) return false;

      const [hours, minutes] = med.time.split(":");
      const medTime = new Date();
      medTime.setHours(hours, minutes, 0);

      const diffMinutes = Math.floor((now - medTime) / 60000);

      // due or recently missed (within 5 minutes)
      return diffMinutes >= 0 && diffMinutes <= 5;
    });

    if (dueMedicine) {
      setActiveReminder(dueMedicine);
    }
  }, [medicines]);


  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);


  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !time) {
      alert("Please fill all fields");
      return;
    }

    const newMedicine = {
      id: Date.now(),
      name,
      time,
      takenToday: false,
    };

    addMedicine(newMedicine);
    setName("");
    setTime("");
  };

  const getStatus = (med) => {
    const now = new Date();
    const [hours, minutes] = med.time.split(":");
    const medTime = new Date();
    medTime.setHours(hours, minutes, 0);

    if (med.takenToday) {
      return "Taken ✅";
    }

    if (now > medTime) {
      return "Missed ❌";
    }

    return "Upcoming ⏳";
  };

  const getDueMedicines = () => {
    return medicines.filter((med) => getStatus(med) === "Upcoming ⏳");
  };

  const getMissedMedicines = () => {
    return medicines.filter((med) => getStatus(med) === "Missed ❌");
  };

  return (
  <>
    <Navbar />

    <div className="dashboard">
      {/* HERO */}
      <section className="hero">
        <h1>Take Care of Your Health</h1>
        <p>
          Consistency is more important than perfection.
          Take your medicines on time.
        </p>
      </section>

      <div className="panel" style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
          ⓘ <strong>Reminder note:</strong> Medicine reminders are shown while the app
          is open. For continuous reminders in real-world usage, this system can be
          extended with mobile notifications or backend push services.
        </p>
      </div>


      {/* STATUS GRID */}
      <section className="status-grid">
        <div className="status-card upcoming">
          <h3>Upcoming</h3>
          {getDueMedicines().length === 0 ? (
            <p className="empty">No upcoming medicines</p>
          ) : (
            getDueMedicines().map((med) => (
              <div key={med.id} className="medicine-row">
                <span>{med.name}--</span>
                <span>{med.time}</span>
              </div>
            ))
          )}
        </div>

        <div className="status-card missed">
          <h3>Missed</h3>
          {getMissedMedicines().length === 0 ? (
            <p className="empty">No missed medicines</p>
          ) : (
            getMissedMedicines().map((med) => (
              <div key={med.id} className="medicine-row">
                <span>{med.name}--</span>
                <span>{med.time}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ACTIONS */}
      <section className="actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAdd(true);
            setShowAll(false);
          }}
        >
           ➕ Add Medicine
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowAll(true);
            setShowAdd(false);
          }}
        >
         📋  View All Medicines
        </button>
      </section>

      {/* PANELS */}
      {showAdd && (
      <section className="panel">
        <h3>Add Medicine</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd(e);
          }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            placeholder="Medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: "1", minWidth: "200px" }}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ minWidth: "140px" }}
          />

          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </section>
    )}

  {showAll && (
    <section className="panel">
      <h3>All Medicines</h3>

      {medicines.length === 0 ? (
        <p className="empty">No medicines added yet</p>
      ) : (
        medicines.map((med) => (
          <div key={med.id} className="medicine-row">
    {editingId === med.id ? (
      <>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          style={{ marginRight: "8px", minWidth: "160px" }}
        />

        <input
          type="time"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          style={{ marginRight: "8px" }}
        />

        <button
          className="btn btn-primary"
          onClick={() => {
            updateMedicine({
              ...med,
              name: editName,
              time: editTime,
            });
            setEditingId(null);
          }}
        >
          Save
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setEditingId(null)}
          style={{ marginLeft: "6px" }}
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <span>{med.name}--</span>
        <span>{med.time}</span>

        <div>
          <button
            className={`btn ${
              med.takenToday ? "btn-secondary" : "btn-success"
            }`}
            onClick={() => toggleTaken(med.id)}
          >
            {med.takenToday ? "Undo" : "Taken"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditingId(med.id);
              setEditName(med.name);
              setEditTime(med.time);
            }}
            style={{ marginLeft: "6px" }}
          >
            ✏️ Edit
          </button>

          <button
            className="btn btn-danger"
            onClick={() => deleteMedicine(med.id)}
            style={{ marginLeft: "6px" }}
          >
            🗑 Delete
          </button>
        </div>
      </>
    )}
  </div>
        ))
      )}
    </section>
  )}

  {activeReminder && (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        width: "280px",
        zIndex: 1000,
      }}
    >
    <h4 style={{ marginBottom: "6px" }}>🔔 Medicine Reminder</h4>
    <p style={{ fontSize: "14px", color: "#374151" }}>
      Time to take <strong>{activeReminder.name}</strong>
      <br />
      Scheduled at {activeReminder.time}
    </p>
    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
      <button
        className="btn btn-success"
        onClick={() => {
          toggleTaken(activeReminder.id);
          setActiveReminder(null);
        }}
      >
        Taken
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setActiveReminder(null)}
      >
        Dismiss
      </button>
    </div>
  </div>
  )}
  </div>
  </>
);

}

export default Dashboard;
