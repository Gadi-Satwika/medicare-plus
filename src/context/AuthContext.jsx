import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // Load user from localStorage on app start
  useEffect(() => {
  const savedUser = localStorage.getItem("medicare_user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
    setLoading(false);
  }, []);


  const login = (email) => {
    const users = JSON.parse(localStorage.getItem("medicare_users")) || [];

    if (!users.includes(email)) {
      return false; // user not found
    }

    const userData = { email };
    setUser(userData);
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    return true;
  };

  const signup = (email) => {
    const users = JSON.parse(localStorage.getItem("medicare_users")) || [];

    if (users.includes(email)) {
      return false; // already exists
    }

    users.push(email);
    localStorage.setItem("medicare_users", JSON.stringify(users));

    const userData = { email };
    setUser(userData);
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    return true;
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("medicare_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
