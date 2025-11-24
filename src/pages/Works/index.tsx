import { useState, useEffect } from "@lynx-js/react";
import { useAuth } from "~context/AuthContext";
import { navigate } from "~utils/router";
import type { Work } from "~types";
import "./index.scss";

export function Works() {
  const { isAuthenticated } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 实际应该从后端API获取作品列表
    // 这里使用模拟数据
    const mockWorks: Work[] = [
      {
        id: "1",
        userId: "1",
        title: "刻晴 Cosplay",
        description: "第一次尝试刻晴的Cos，希望大家喜欢！",
        images: ["https://via.placeholder.com/400"],
        coverIndex: 0,
        tags: [
          { id: "1", type: "character", name: "刻晴" },
          { id: "2", type: "source", name: "原神" },
          { id: "3", type: "style", name: "清新" },
        ],
        coserIds: ["1"],
        visibility: "public",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setWorks(mockWorks);
    setLoading(false);
  }, []);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <view className="Works">
      <view className="Works__header">
        <text className="Works__title">作品展示</text>
        <view className="Works__actions">
          <view
            className="Works__button"
            bindtap={() => navigate("/create-work")}
          >
            <text>发布作品</text>
          </view>
          <view className="Works__button" bindtap={() => navigate("/profile")}>
            <text>个人资料</text>
          </view>
        </view>
      </view>

      <view className="Works__container">
        {loading ? (
          <view className="Works__loading">
            <text>加载中...</text>
          </view>
        ) : works.length === 0 ? (
          <view className="Works__empty">
            <text className="Works__empty-text">还没有作品</text>
            <view
              className="Works__button"
              bindtap={() => navigate("/create-work")}
            >
              <text>发布第一个作品</text>
            </view>
          </view>
        ) : (
          <view className="Works__grid">
            {works.map((work) => (
              <view
                key={work.id}
                className="Works__item"
                bindtap={() => navigate(`/work/${work.id}`)}
              >
                <view className="Works__image-wrapper">
                  <image
                    src={work.images[work.coverIndex] || work.images[0]}
                    className="Works__image"
                  />
                  {work.images.length > 1 && (
                    <view className="Works__image-count">
                      <text>{work.images.length}</text>
                    </view>
                  )}
                </view>
                <view className="Works__info">
                  <text className="Works__title-text">{work.title}</text>
                  <text className="Works__description">{work.description}</text>
                  <view className="Works__tags">
                    {work.tags.slice(0, 3).map((tag) => (
                      <view
                        key={tag.id}
                        className={`Works__tag Works__tag--${tag.type}`}
                      >
                        <text>{tag.name}</text>
                      </view>
                    ))}
                    {work.tags.length > 3 && (
                      <view className="Works__tag">
                        <text>+{work.tags.length - 3}</text>
                      </view>
                    )}
                  </view>
                </view>
              </view>
            ))}
          </view>
        )}
      </view>
    </view>
  );
}
