import { useEffect } from "@lynx-js/react";
import { AuthProvider } from "~/context/AuthContext";
import { initRouter, useRouter } from "~/utils/router";
import { Home } from "~/pages/Home";
import { Login } from "~/pages/Login";
import { Profile } from "~/pages/Profile";
import { Works } from "~/pages/Works";
import { CreateWork } from "~/pages/CreateWork";
import "~/App.scss";

function AppContent() {
  const { matchedRoute, currentPath, navigate } = useRouter();

  useEffect(() => {
    // 初始化路由
    initRouter([
      { path: "/", component: () => <Home /> },
      { path: "/login", component: () => <Login /> },
      { path: "/profile", component: () => <Profile />, requireAuth: true },
      { path: "/works", component: () => <Works />, requireAuth: true },
      {
        path: "/create-work",
        component: () => <CreateWork />,
        requireAuth: true,
      },
    ]);
  }, []);

  useEffect(() => {
    // 如果找不到匹配的路由，跳转到首页
    if (!matchedRoute && currentPath !== "/") {
      navigate("/");
    }
  }, [matchedRoute, currentPath, navigate]);

  // 如果找不到匹配的路由，显示 Home 页面
  if (!matchedRoute) {
    return (
      <view className="App">
        <Home />
      </view>
    );
  }

  return <view className="App">{matchedRoute.component()}</view>;
}

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    console.info("Coser Platform App loaded");
  }, []);

  props.onRender?.();

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
