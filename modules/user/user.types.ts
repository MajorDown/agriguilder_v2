export type PublicUser = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    society?: string;
    phone: string;
}

export type UserCreationContext = 'byAdmin' | 'selfSignUp';

export type CreateUserInput = {
    email: string;
    password?: string;
    firstname: string;
    lastname: string;
    society?: string;
    phone : string;
    context: UserCreationContext;
}

export type UpdateUserInfosInput = {
    id: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    society?: string;
}

export type UpdateUserPasswordInput = {
    id: string;
    currentPassword: string;
    newPassword: string;
}

export type UpdateUserEmailInput = {
    id: string;
    currentPassword: string;
    newEmail: string;
}
