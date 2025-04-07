import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

const apiUrl = import.meta.env.VITE_API_URL;
const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  
  useEffect(() => {

    // Check if user is already signed in (with token in local storage), 不是必要，但比下面的更快
    /*const token = localStorage.getItem("supabaseToken");
    if (token) {
      supabase.auth.getSession().then(({data: {session}}) => {
        if (session?.user) { // session exists, as token is valid
          localStorage.setItem("supabaseToken", session.access_token); // save token to local storage
          console.log("User already signed in")
          setUser(session.user);
        }
      });
    }*/

    // Listen for auth changes (e.g. 页面加载, user signin, signout, token refresh, etc.) 注意这是异步的，需要时间完成检测，做为保底
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("state change event:", event);

        if (event === "TOKEN_REFRESH") {
          console.log("Token refreshed");
          return;
        }

        if (session?.user) { // session exists, as token is valid
          localStorage.setItem("supabaseToken", session.access_token); // save token to local storage
          console.log("User is signed in")
          const lastUserId = localStorage.getItem("lastUserId");

          // only update user data if user_id has changed (to avoid unnecessary requests)
          if (session.user.id !== lastUserId) {
            //console.log("state change event:", event);
            localStorage.setItem("lastUserId", session.user.id);
            const userData = await ensureUserInDatabase();  // get additional user data like tokens, role, etc.
            setUser({ // combine with auth user data
              ...session.user,
              tokens: userData?.tokens,
              role: userData?.role,
            }); 
            console.log("User additional data is pulled");
          } else { // update user data without pulling additional data, use previous data
            setUser(prevUser => ({
              ...session.user,
              tokens: prevUser?.tokens,
              role: prevUser?.role,
            }));  
          } 
        } else {
          setUser(null);
          localStorage.removeItem("supabaseToken"); // remove token from local storage when user signs out
          localStorage.removeItem("lastUserId");
          console.log("User is signed out")
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


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
