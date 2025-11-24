// 用户角色类型
export type UserRole = "coser" | "photographer";

// 用户信息
export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  nickname: string;
  avatar?: string;
  bio?: string;
  city: string;
  // Coser 专属字段
  representativeWorks?: string[]; // 代表作角色
  height?: number; // 身高（cm）
  characterTypes?: string[]; // 常出角色类型
  // 摄影师专属字段
  equipment?: string[]; // 设备
  specialties?: string[]; // 擅长风格
  portfolioLink?: string; // 作品集链接
  createdAt: string;
  updatedAt: string;
}

// Tag 类型
export type TagType = "character" | "source" | "style" | "location" | "person";

export interface Tag {
  id: string;
  type: TagType;
  name: string;
  userId?: string; // 如果是人员Tag，关联用户ID
}

// 作品权限
export type WorkVisibility = "public" | "private";

// 作品信息
export interface Work {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[]; // 图片URL数组
  coverIndex: number; // 封面图片索引
  tags: Tag[];
  // 人员Tag
  photographerId?: string; // 摄影师ID
  coserIds: string[]; // Coser ID数组
  makeupArtistIds?: string[]; // 妆娘ID数组
  editorIds?: string[]; // 后期ID数组
  visibility: WorkVisibility;
  createdAt: string;
  updatedAt: string;
}

// 登录/注册表单
export interface AuthForm {
  email?: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

// 个人资料表单
export interface ProfileForm {
  nickname: string;
  avatar?: string;
  bio?: string;
  city: string;
  // Coser 字段
  representativeWorks?: string[];
  height?: number;
  characterTypes?: string[];
  // 摄影师字段
  equipment?: string[];
  specialties?: string[];
  portfolioLink?: string;
}

// 作品发布表单
export interface WorkForm {
  title: string;
  description: string;
  images: File[];
  coverIndex: number;
  tags: Tag[];
  photographerId?: string;
  coserIds: string[];
  makeupArtistIds?: string[];
  editorIds?: string[];
  visibility: WorkVisibility;
}
