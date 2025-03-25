export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface ProfileFormData {
  username: string;
  full_name: string;
  bio: string;
  role?: string;
  skills?: string[];
  social_links?: SocialLinks;
}

export interface UserProjectResponse {
  id: string;
  role: string;
  joined_at: string;
  project: {
    id: string;
    name: string;
    status: string;
  };
}

export interface UserEventResponse {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    date: string;
    type: string;
  };
}

export interface UserProject {
  id: string;
  name: string;
  status: string;
  role: string;
  joined_at: string;
}

export interface UserEvent {
  id: string;
  title: string;
  date: string;
  status: string;
  type: string;
}

export interface UserActivity {
  projects: UserProject[];
  events: UserEvent[];
}
