import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask the server who we are on first load
  useEffect(() => {
    api.me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signin = useCallback(async (user_id, password) => {
    const data = await api.signin({ user_id, password });
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback((user_id, password, name) =>
    api.signup({ user_id, password, name }), []);

  const signout = useCallback(async () => {
    await api.signout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}