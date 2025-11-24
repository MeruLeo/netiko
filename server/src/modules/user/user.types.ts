//? skill
export interface Skill {
  name: string;
  normalized?: string;
  level: 'beginner' | 'intermediate' | 'professional' | 'expert';
  years?: number;
  lastUsed?: Date;
  category?: string;
  skillId?: string;
}

//? language
export interface Language {
  title: string;
  level: 'beginner' | 'intermediate' | 'professional' | 'native';
}

//? social media
export interface SocialMedia {
  platform: 'instagram' | 'linkedin' | 'github' | 'twitter' | 'facebook' | 'website';
  url: string;
  title?: string;
}

//? contact info
export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

//? military service
export type MilitaryService =
  | 'eligible' // مشمول
  | 'exemptPermanent' // معاف دائم
  | 'exemptTemporary' // معاف موقت
  | 'completed' // انجام شده / اتمام خدمت
  | 'inService' // در حال انجام
  | 'absent' // غایب / فراری
  | 'caregiver' // کفالت
  | 'reserve'; // ذخیره

export interface IUser {
  clerkId: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName: string;
  lastName: string;

  bio?: string;
  headLine?: string;
  birthday?: Date;
  contact?: ContactInfo;
  languages?: Language[];
  skills?: Skill[];
  socialMedia?: SocialMedia[];
  militaryService?: MilitaryService;

  country?: string;
  city?: string;
  avatar?: string;
  memoji?: string;
  banner?: string;
  logo?: string;

  status: 'active' | 'suspended' | 'banned';
  openToWork?: boolean;
  isVerified: boolean;
  marriage?: boolean;

  counts?: {
    projects?: number;
    workExps?: number;
    educations?: number;
    achievements?: number;
  };

  pinnedProjectIds?: string[];

  createdAt: Date;
  updatedAt: Date;
}

//Filters
export interface UserFilters {
  username?: string;
  email?: string;
  role?: IUser['role'];
  status?: IUser['status'];

  // profile
  country?: string;
  city?: string;
  openToWork?: boolean;
  isVerified?: boolean;

  // skills
  skillName?: string;
  skillLevel?: Skill['level'];

  // languages
  languageTitle?: string;
  languageLevel?: Language['level'];

  // military service
  military?: MilitaryService;
}
