// ============================================================
// Domain Interfaces
// ============================================================

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Board {
  species: string;
  length: number;
  width: number;
  thickness: number;
  quantity: number;
}

export interface Design {
  _id: string;
  userId: string;
  name: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'imperial' | 'metric';
  };
  materials: MaterialItem[];
  boards: Board[];
  notes: string;
  thumbnailFileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  userId: string;
  designId: string;
  customerId: string;
  name: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  completedDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  _id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileKey: string;
  mimeType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes: string;
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  _id: string;
  userId: string;
  measurementSystem: 'imperial' | 'metric';
  margins: {
    length: number;
    width: number;
    thickness: number;
  };
  driveStoragePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
}

// ============================================================
// DTO Types (Data Transfer Objects for create/update operations)
// ============================================================

export type CreateDesignDTO = Omit<Design, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateDesignDTO = Partial<CreateDesignDTO>;

export type CreateProjectDTO = Omit<Project, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

export type CreateCustomerDTO = Omit<Customer, '_id' | 'userId' | 'projects' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

export type UpdateSettingsDTO = Partial<Pick<Settings, 'measurementSystem' | 'margins' | 'driveStoragePath'>>;
