import { useState, useEffect } from "@lynx-js/react";
import { useAuth } from "~context/AuthContext";
import { navigate } from "~utils/router";
import type { ProfileForm } from "~types";
import "./index.scss";

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    nickname: "",
    bio: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nickname: user.nickname || "",
        avatar: user.avatar,
        bio: user.bio || "",
        city: user.city || "",
        representativeWorks: user.representativeWorks || [],
        height: user.height,
        characterTypes: user.characterTypes || [],
        equipment: user.equipment || [],
        specialties: user.specialties || [],
        portfolioLink: user.portfolioLink,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.nickname || !form.city) {
      alert("请填写昵称和所在城市");
      return;
    }

    setSaving(true);
    try {
      updateUser(form);
      alert("保存成功！");
    } catch {
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: any) => {
    // TODO: 实际应该上传图片到服务器
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm({ ...form, avatar: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const isCoser = user.role === "coser";
  const isPhotographer = user.role === "photographer";

  return (
    <view className="Profile">
      <view className="Profile__header">
        <text className="Profile__title">个人资料</text>
        <view className="Profile__actions">
          <view className="Profile__button" bindtap={() => navigate("/works")}>
            <text>我的作品</text>
          </view>
          <view className="Profile__button" bindtap={logout}>
            <text>退出登录</text>
          </view>
        </view>
      </view>

      <view className="Profile__container">
        <view className="Profile__section">
          <text className="Profile__section-title">基本信息</text>

          <view className="Profile__avatar-upload">
            <view className="Profile__avatar">
              {form.avatar ? (
                <image src={form.avatar} className="Profile__avatar-img" />
              ) : (
                <text className="Profile__avatar-placeholder">上传头像</text>
              )}
            </view>
            {/* <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              id="avatar-input"
            /> */}
            <view
              className="Profile__upload-button"
              bindtap={() => {
                const input = document.getElementById("avatar-input");
                input?.click();
              }}
            >
              <text>选择头像</text>
            </view>
          </view>

          <view className="Profile__field">
            <text className="Profile__label">昵称 *</text>
            <input
              className="Profile__input"
              bindinput={(e: any) =>
                setForm({ ...form, nickname: e.detail.value || "" })
              }
              placeholder="请输入昵称"
            />
          </view>

          <view className="Profile__field">
            <text className="Profile__label">简介</text>
            <textarea
              className="Profile__textarea"
              bindinput={(e: any) =>
                setForm({ ...form, bio: e.detail.value || "" })
              }
              placeholder="介绍一下自己吧..."
            />
          </view>

          <view className="Profile__field">
            <text className="Profile__label">所在城市 *</text>
            <input
              className="Profile__input"
              bindinput={(e: any) =>
                setForm({ ...form, city: e.detail.value || "" })
              }
              placeholder="请输入所在城市"
            />
          </view>
        </view>

        {isCoser && (
          <view className="Profile__section">
            <text className="Profile__section-title">Coser 专属信息</text>

            <view className="Profile__field">
              <text className="Profile__label">代表作角色</text>
              <input
                className="Profile__input"
                bindinput={(e: any) =>
                  setForm({
                    ...form,
                    representativeWorks: e.detail.value || "",
                  })
                }
                placeholder="用逗号分隔，如：刻晴, 胡桃"
              />
            </view>

            <view className="Profile__field">
              <text className="Profile__label">身高 (cm)</text>
              <input
                className="Profile__input"
                type="number"
                bindinput={(e: any) =>
                  setForm({
                    ...form,
                    height: parseInt(e.detail.value) || undefined,
                  })
                }
                placeholder="可选"
              />
            </view>

            <view className="Profile__field">
              <text className="Profile__label">常出角色类型</text>
              <input
                className="Profile__input"
                bindinput={(e: any) =>
                  setForm({
                    ...form,
                    characterTypes: e.detail.value
                      .split(",")
                      .map((t: string) => t.trim()),
                  })
                }
                placeholder="用逗号分隔，如：古风, 二次元, 赛博朋克"
              />
            </view>
          </view>
        )}

        {isPhotographer && (
          <view className="Profile__section">
            <text className="Profile__section-title">摄影师专属信息</text>

            <view className="Profile__field">
              <text className="Profile__label">设备</text>
              <input
                className="Profile__input"
                bindinput={(e: any) =>
                  setForm({ ...form, equipment: e.detail.value || "" })
                }
                placeholder="用逗号分隔，如：Canon EOS R5, Sony A7III"
              />
            </view>

            <view className="Profile__field">
              <text className="Profile__label">擅长风格</text>
              <input
                className="Profile__input"
                bindinput={(e: any) =>
                  setForm({ ...form, specialties: e.detail.value || "" })
                }
                placeholder="用逗号分隔，如：古风, 赛博朋克, 人像"
              />
            </view>

            <view className="Profile__field">
              <text className="Profile__label">作品集链接</text>
              <input
                className="Profile__input"
                bindinput={(e: any) =>
                  setForm({ ...form, portfolioLink: e.detail.value || "" })
                }
                placeholder="https://..."
              />
            </view>
          </view>
        )}

        <view className="Profile__actions-bottom">
          <view className="Profile__save-button" bindtap={handleSave}>
            <text>{saving ? "保存中..." : "保存资料"}</text>
          </view>
        </view>
      </view>
    </view>
  );
}
