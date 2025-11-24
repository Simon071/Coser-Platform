import { useState } from "@lynx-js/react";
import { useAuth } from "~context/AuthContext";
import { navigate } from "~utils/router";
import type { Tag, WorkVisibility } from "~types";
import "./index.scss";

export function CreateWork() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagType, setNewTagType] = useState<
    "character" | "source" | "style" | "location"
  >("character");
  const [visibility, setVisibility] = useState<WorkVisibility>("public");
  const [saving, setSaving] = useState(false);

  // 人员Tag相关
  const [photographerId, setPhotographerId] = useState("");
  const [coserIds, setCoserIds] = useState<string[]>([]);
  const [makeupArtistIds, setMakeupArtistIds] = useState<string[]>([]);
  const [editorIds, setEditorIds] = useState<string[]>([]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleImageSelect = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    const newImages = [...images, ...files];
    setImages(newImages);

    // 生成预览
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (coverIndex >= newImages.length) {
      setCoverIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const newTag: Tag = {
      id: Date.now().toString(),
      type: newTagType,
      name: newTagName.trim(),
    };

    setTags([...tags, newTag]);
    setNewTagName("");
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("请输入作品标题");
      return;
    }

    if (images.length === 0) {
      alert("请至少上传一张图片");
      return;
    }

    if (tags.filter((t) => t.type === "character").length === 0) {
      alert("请至少添加一个角色Tag");
      return;
    }

    if (tags.filter((t) => t.type === "source").length === 0) {
      alert("请至少添加一个作品来源Tag");
      return;
    }

    setSaving(true);
    try {
      // TODO: 实际上传图片和创建作品
      console.log("发布作品", {
        title,
        description,
        images,
        coverIndex,
        tags,
        photographerId,
        coserIds,
        makeupArtistIds,
        editorIds,
        visibility,
      });
      alert("发布成功！");
      navigate("/works");
    } catch {
      alert("发布失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <view className="CreateWork">
      <view className="CreateWork__header">
        <text className="CreateWork__title">发布作品</text>
        <view className="CreateWork__button" bindtap={() => navigate("/works")}>
          <text>返回</text>
        </view>
      </view>

      <view className="CreateWork__container">
        <view className="CreateWork__section">
          <text className="CreateWork__section-title">基本信息</text>

          <view className="CreateWork__field">
            <text className="CreateWork__label">作品标题 *</text>
            <input
              className="CreateWork__input"
              bindinput={(e: any) => setTitle(e.detail.value || "")}
              placeholder="给你的作品起个标题吧"
            />
          </view>

          <view className="CreateWork__field">
            <text className="CreateWork__label">作品描述</text>
            <textarea
              className="CreateWork__textarea"
              bindinput={(e: any) => setDescription(e.detail.value || "")}
              placeholder="分享这套片子的故事、角色心得、拍摄花絮..."
            />
          </view>
        </view>

        <view className="CreateWork__section">
          <text className="CreateWork__section-title">图片上传 *</text>

          <view className="CreateWork__image-upload">
            {/* <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: "none" }}
              id="image-input"
            /> */}
            <view
              className="CreateWork__upload-button"
              bindtap={() => {
                const input = document.getElementById("image-input");
                input?.click();
              }}
            >
              <text>选择图片</text>
            </view>
          </view>

          {imagePreviews.length > 0 && (
            <view className="CreateWork__image-grid">
              {imagePreviews.map((preview, index) => (
                <view key={index} className="CreateWork__image-item">
                  <image src={preview} className="CreateWork__image" />
                  <view
                    className="CreateWork__image-remove"
                    bindtap={() => handleRemoveImage(index)}
                  >
                    <text>×</text>
                  </view>
                  {index === coverIndex && (
                    <view className="CreateWork__image-cover">
                      <text>封面</text>
                    </view>
                  )}
                  <view
                    className="CreateWork__image-set-cover"
                    bindtap={() => setCoverIndex(index)}
                  >
                    <text>
                      {index === coverIndex ? "已设为封面" : "设为封面"}
                    </text>
                  </view>
                </view>
              ))}
            </view>
          )}
        </view>

        <view className="CreateWork__section">
          <text className="CreateWork__section-title">标签系统 *</text>

          <view className="CreateWork__tag-input">
            <view className="CreateWork__tag-type-select">
              <view
                className={`CreateWork__tag-type ${newTagType === "character" ? "active" : ""}`}
                bindtap={() => setNewTagType("character")}
              >
                <text>角色</text>
              </view>
              <view
                className={`CreateWork__tag-type ${newTagType === "source" ? "active" : ""}`}
                bindtap={() => setNewTagType("source")}
              >
                <text>来源</text>
              </view>
              <view
                className={`CreateWork__tag-type ${newTagType === "style" ? "active" : ""}`}
                bindtap={() => setNewTagType("style")}
              >
                <text>风格</text>
              </view>
              <view
                className={`CreateWork__tag-type ${newTagType === "location" ? "active" : ""}`}
                bindtap={() => setNewTagType("location")}
              >
                <text>地点</text>
              </view>
            </view>
            <input
              className="CreateWork__input"
              bindinput={(e: any) => setNewTagName(e.detail.value || "")}
              placeholder="输入标签名称"
            />
            <view className="CreateWork__button-small" bindtap={handleAddTag}>
              <text>添加</text>
            </view>
          </view>

          <view className="CreateWork__tags">
            {tags.map((tag) => (
              <view
                key={tag.id}
                className={`CreateWork__tag CreateWork__tag--${tag.type}`}
              >
                <text>
                  {tag.type === "character"
                    ? "角色"
                    : tag.type === "source"
                      ? "来源"
                      : tag.type === "style"
                        ? "风格"
                        : "地点"}
                  : {tag.name}
                </text>
                <text
                  className="CreateWork__tag-remove"
                  bindtap={() => handleRemoveTag(tag.id)}
                >
                  ×
                </text>
              </view>
            ))}
          </view>

          <view className="CreateWork__hint">
            <text>
              * 必填：至少一个角色Tag和一个来源Tag（如《原神》、《咒术回战》）
            </text>
          </view>
        </view>

        <view className="CreateWork__section">
          <text className="CreateWork__section-title">人员信息</text>

          {user.role === "coser" && (
            <view className="CreateWork__field">
              <text className="CreateWork__label">摄影师</text>
              <input
                className="CreateWork__input"
                bindinput={(e: any) => setPhotographerId(e.detail.value || "")}
                placeholder="输入摄影师ID或用户名（可选，留空表示寻找摄影师）"
              />
            </view>
          )}

          {user.role === "photographer" && (
            <view className="CreateWork__field">
              <text className="CreateWork__label">Coser *</text>
              <input
                className="CreateWork__input"
                bindinput={(e: any) => setCoserIds(e.detail.value || "")}
                placeholder="输入Coser ID或用户名，多个用逗号分隔"
              />
            </view>
          )}

          <view className="CreateWork__field">
            <text className="CreateWork__label">妆娘</text>
            <input
              className="CreateWork__input"
              bindinput={(e: any) => setMakeupArtistIds(e.detail.value || "")}
              placeholder="输入妆娘ID或用户名（可选）"
            />
          </view>

          <view className="CreateWork__field">
            <text className="CreateWork__label">后期</text>
            <input
              className="CreateWork__input"
              bindinput={(e: any) => setEditorIds(e.detail.value || "")}
              placeholder="输入后期ID或用户名（可选）"
            />
          </view>
        </view>

        <view className="CreateWork__section">
          <text className="CreateWork__section-title">权限设置</text>
          <view className="CreateWork__visibility">
            <view
              className={`CreateWork__visibility-item ${visibility === "public" ? "active" : ""}`}
              bindtap={() => setVisibility("public")}
            >
              <text>公开</text>
            </view>
            <view
              className={`CreateWork__visibility-item ${visibility === "private" ? "active" : ""}`}
              bindtap={() => setVisibility("private")}
            >
              <text>仅自己可见</text>
            </view>
          </view>
        </view>

        <view className="CreateWork__actions">
          <view className="CreateWork__submit-button" bindtap={handleSubmit}>
            <text>{saving ? "发布中..." : "发布作品"}</text>
          </view>
        </view>
      </view>
    </view>
  );
}
