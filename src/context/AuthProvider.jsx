import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const apiUrl = import.meta.env.VITE_API_URL;
const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await ensureUserInDatabase(session.user.id); 
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };  

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: "https://ai-editor-frontend.vercel.app" }, // 生产环境改成正式域名 http://localhost:5173
    });
    if (error) console.error("Login Error:", error.message);
  };

  // call backend to ensure user is in database
  async function ensureUserInDatabase(userId) {
    try {
      const response = await fetch(`${apiUrl}/ensure_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({user_id: userId}),
      });

      if (!response.ok) {
        console.error("Failed to ensure user in database");
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook，让组件更容易获取 Auth 状态
export function useAuth() {
  return useContext(AuthContext);
}
