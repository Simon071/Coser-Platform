import { useState } from "@lynx-js/react";
import { useAuth } from "~/context/AuthContext";
import { navigate } from "~/utils/router";
import type { UserRole } from "~/types";
import "./index.scss";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [authType, setAuthType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");

  const { login, register } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (!password) {
      setError("请输入密码");
      return;
    }

    if (!isLogin && !role) {
      setError("请选择您的身份");
      return;
    }

    if (authType === "email" && !email) {
      setError("请输入邮箱");
      return;
    }

    if (authType === "phone" && !phone) {
      setError("请输入手机号");
      return;
    }

    try {
      if (isLogin) {
        await login({
          email: authType === "email" ? email : undefined,
          phone: authType === "phone" ? phone : undefined,
          password,
        });
      } else {
        await register({
          email: authType === "email" ? email : undefined,
          phone: authType === "phone" ? phone : undefined,
          password,
          role: role || undefined,
        });
      }
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试");
    }
  };

  return (
    <view className="Login">
      <view className="Login__container">
        <text className="Login__title">
          {isLogin ? "登录" : "注册"} - Coser 平台
        </text>

        <view className="Login__auth-type">
          <view
            className={`Login__auth-type-item ${authType === "email" ? "active" : ""}`}
            bindtap={() => setAuthType("email")}
          >
            <text>邮箱</text>
          </view>
          <view
            className={`Login__auth-type-item ${authType === "phone" ? "active" : ""}`}
            bindtap={() => setAuthType("phone")}
          >
            <text>手机号</text>
          </view>
        </view>

        {authType === "email" ? (
          <view className="Login__input-group">
            <text className="Login__label">邮箱</text>
            <input
              className="Login__input"
              type="email"
              placeholder="请输入邮箱"
              bindinput={(e: any) => setEmail(e.detail.value || "")}
            />
          </view>
        ) : (
          <view className="Login__input-group">
            <text className="Login__label">手机号</text>
            <input
              className="Login__input"
              type="tel"
              placeholder="请输入手机号"
              bindinput={(e: any) => setPhone(e.detail.value || "")}
            />
          </view>
        )}

        <view className="Login__input-group">
          <text className="Login__label">密码</text>
          <input
            className="Login__input"
            type="password"
            placeholder="请输入密码"
            bindinput={(e: any) => setPassword(e.detail.value || "")}
          />
        </view>

        {!isLogin && (
          <view className="Login__role-selection">
            <text className="Login__label">选择身份</text>
            <view className="Login__roles">
              <view
                className={`Login__role-item ${role === "coser" ? "active" : ""}`}
                bindtap={() => setRole("coser")}
              >
                <text>Coser</text>
              </view>
              <view
                className={`Login__role-item ${role === "photographer" ? "active" : ""}`}
                bindtap={() => setRole("photographer")}
              >
                <text>摄影师</text>
              </view>
            </view>
          </view>
        )}

        {error && <text className="Login__error">{error}</text>}

        <view className="Login__button" bindtap={handleSubmit}>
          <text>{isLogin ? "登录" : "注册"}</text>
        </view>

        <view className="Login__switch">
          <text
            bindtap={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "还没有账号？点击注册" : "已有账号？点击登录"}
          </text>
        </view>
      </view>
    </view>
  );
}
