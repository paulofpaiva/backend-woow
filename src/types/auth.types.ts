export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}

export interface UpdateProfileBody {
  name: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserDto;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListUsersResponse {
  users: UserDto[];
  pagination: PaginationMeta;
}
