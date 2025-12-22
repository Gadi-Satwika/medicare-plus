import Navbar from "../components/Navbar";
import { useMedicines } from "../context/MedicineContext";

function Analytics() {
  const { medicines } = useMedicines();
  const total = medicines.length;
  const takenToday = medicines.filter(
    (med) => med.takenToday
  ).length;

  const missedToday = medicines.filter((med) => {
    const now = new Date();
    const [hours, minutes] = med.time.split(":");
    const medTime = new Date();
    medTime.setHours(hours, minutes, 0);

    return !med.takenToday && now > medTime;
  }).length;

  const adherence =
  total === 0 ? 0 : Math.round((takenToday / total) * 100);
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700" }}>
                Analytics
            </h1>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
                Overview of your daily medicine adherence
            </p>
        </div>


        <div className="status-grid">
            <div className="status-card">
                <h3>Total Medicines</h3>
                <p className="metric">
                {total}
                </p>
            </div>

            <div className="status-card">
                <h3>Taken Today</h3>
                <p className="metric success">
                {takenToday}
                </p>
            </div>

            <div className="status-card">
                <h3>Missed Today</h3>
                <p className="metric danger">
                {missedToday}
                </p>
            </div>

            <div className="status-card">
                <h3>Adherence</h3>
                <p className="metric">
                {adherence}%
                </p>
            </div>
        </div>
        <div className="panel">
            {total === 0 ? (
                <p className="empty">
                Start adding medicines to see your adherence insights.
                </p>
            ) : adherence >= 80 ? (
                <p style={{ color: "#065f46", fontWeight: "500" }}>
                👍 Great job! You are maintaining a healthy adherence rate.
                </p>
            ) : (
                <p style={{ color: "#92400e", fontWeight: "500" }}>
                ⚠️ Try to improve your consistency to maintain better health.
                </p>
            )}
        </div>


    </div>
    </>
  );
}

export default Analytics;
