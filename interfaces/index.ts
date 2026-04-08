export type UserRole = 'superadmin' | 'user';

export interface General { 
    id: string;
    name: string;
    data: string;
}

export interface Viewer { 
    id: string;
    ip: string;
    post_id: string | null;
    created_at: string;
}
