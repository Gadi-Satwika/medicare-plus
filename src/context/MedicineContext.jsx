import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MedicineContext = createContext();

export function MedicineProvider({ children }) {
  const { user } = useAuth();

  const storageKey = user
    ? `medicare_medicines_${user.email}`
    : null;

  const [medicines, setMedicines] = useState([]);

  // Load medicines when user changes
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      setMedicines(saved ? JSON.parse(saved) : []);
    } else {
      setMedicines([]);
    }
  }, [storageKey]);

  // Save medicines for the logged-in user
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(medicines));
    }
  }, [medicines, storageKey]);

  const addMedicine = (medicine) => {
    setMedicines((prev) => [...prev, medicine]);
  };

  const toggleTaken = (id) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med.id === id
          ? { ...med, takenToday: !med.takenToday }
          : med
      )
    );
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const updateMedicine = (updatedMed) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med.id === updatedMed.id ? updatedMed : med
      )
    );
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        addMedicine,
        toggleTaken,
        deleteMedicine,
        updateMedicine,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicines() {
  return useContext(MedicineContext);
}
