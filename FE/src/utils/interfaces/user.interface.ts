export interface UserDetail {
    id: number;
    email: string;
    username: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUser {
    email: string
}