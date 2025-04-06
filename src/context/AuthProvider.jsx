import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const apiUrl = import.meta.env.VITE_API_URL;
const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {

    // Check if user is already signed in (with token in local storage), if so, set header using this token
    //const token = localStorage.getItem("supabaseToken");
    //if (token) {
    //  supabase.auth.setAuth(token); // set auth headers for api requests
    //}

    // Listen for auth changes (e.g. user signin, signout, token refresh, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          localStorage.setItem("supabaseToken", session.access_token); // save token to local storage
          console.log("User is signed in: ", session.user.id)

          const userData = await ensureUserInDatabase();  // additional user data like tokens, role, etc.
          // combine with auth user data
          setUser({
            ...session.user,
            tokens: userData?.tokens,
            role: userData?.role,
          });          
        } else {
          setUser(null);
          localStorage.removeItem("supabaseToken"); // remove token from local storage when user signs out
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
    localStorage.removeItem("supabaseToken"); // remove token from local storage when user signs out
  };  

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: "https://ai-editor-frontend.vercel.app" }, // 生产环境改成正式域名 http://localhost:5173
    });
    if (error) console.error("Login Error:", error.message);
  };

  // 邮箱密码注册
  const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ 
      email: email,
      password: password,
    });
    if (error) {
      console.error("Error signing up:", error.message);
      return {error: error.message};
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      return {error: "Email already exists"};
    };
    return {user: data.user};
  };

  // 邮箱密码登录
  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email,
      password: password,
    });
    if (error) {
      console.error("Login Error:", error.message);
      return {error: error.message};
    }
    return {user: data.user};
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Error resetting password:", error.message);
      return {error: error.message};
    }
  };

  const signInWithMagicLink = async (email) => { 
    const { error } = await supabase.auth.signInWithOtp({
      email, 
      options: {
        shouldCreateUser: true, // 允许自动注册
        emailRedirectTo: "https://ai-editor-frontend.vercel.app", // 替换成你的正式域名
      },
    });
    if (error) {
      console.error("Login Error:", error.message);
      return {error: error.message};
    }
    return {success: "Check your email for the login link!"};
  };


  async function ensureUserInDatabase() {
    const token = localStorage.getItem("supabaseToken");

    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/ensure_user`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to ensure user in database");
      }

      const data = await response.json();
      //console.log("User details stored in local storage:", data);
      localStorage.setItem("remainingTokens", data.tokens); 
      
      // add to leverage user role data
      return {
        tokens: data.tokens,
        role: data.role,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signUpWithEmail, signInWithEmail, resetPassword, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook，让组件更容易获取 Auth 状态
export function useAuth() {
  return useContext(AuthContext);
}
