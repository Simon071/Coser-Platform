import { useState, useEffect } from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";

type Route = {
  path: string;
  component: () => ReactNode;
  requireAuth?: boolean;
};

let routes: Route[] = [];
let currentPath = "/";
const listeners: Array<() => void> = [];

export function initRouter(routeList: Route[]) {
  routes = routeList;
  // 监听浏览器前进后退
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {
      currentPath = window.location.pathname;
      listeners.forEach((listener) => listener());
    });
  }
}

export function navigate(path: string) {
  currentPath = path;
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", path);
  }
  listeners.forEach((listener) => listener());
}

export function useRouter() {
  const [, setUpdate] = useState(0);

  useEffect(() => {
    const listener = () => {
      setUpdate((prev) => prev + 1);
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getCurrentPath = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return currentPath;
  };

  const matchedRoute = routes.find((route) => {
    const path = getCurrentPath();
    return path === route.path || path.startsWith(route.path + "/");
  });

  return {
    currentPath: getCurrentPath(),
    navigate,
    matchedRoute,
  };
}
