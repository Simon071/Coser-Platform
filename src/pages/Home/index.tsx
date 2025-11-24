import { useAuth } from "~/context/AuthContext";
import { navigate } from "~/utils/router";
import "./index.scss";

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <view className="Home">
      <view className="Home__hero">
        <text className="Home__title">Coser 平台</text>
        <text className="Home__subtitle">
          展示你的 Cosplay 作品，寻找合作伙伴
        </text>
        {!isAuthenticated ? (
          <view className="Home__actions">
            <view
              className="Home__button Home__button--primary"
              bindtap={() => navigate("/login")}
            >
              <text>登录 / 注册</text>
            </view>
          </view>
        ) : (
          <view className="Home__actions">
            <view
              className="Home__button Home__button--primary"
              bindtap={() => navigate("/works")}
            >
              <text>查看作品</text>
            </view>
            <view
              className="Home__button"
              bindtap={() => navigate("/create-work")}
            >
              <text>发布作品</text>
            </view>
          </view>
        )}
      </view>
    </view>
  );
}
