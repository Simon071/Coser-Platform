import { createContext, useContext, useState, useEffect } from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";
import type { User, AuthForm } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (form: AuthForm) => Promise<void>;
  register: (form: AuthForm) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  // 保存用户信息到 localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (form: AuthForm) => {
    // TODO: 实际应该调用后端API
    // 这里使用模拟数据
    const mockUser: User = {
      id: "1",
      email: form.email,
      phone: form.phone,
      role: "coser",
      nickname: "测试用户",
      city: "北京",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(mockUser);
  };

  const register = async (form: AuthForm) => {
    // TODO: 实际应该调用后端API
    // 这里使用模拟数据
    if (!form.role) {
      throw new Error("请选择角色");
    }
    const mockUser: User = {
      id: Date.now().toString(),
      email: form.email,
      phone: form.phone,
      role: form.role,
      nickname: "新用户",
      city: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
