export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = AuthCredentials & {
  firstName: string;
  lastName: string;
};

export type SessionUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isAdmin: boolean;
};

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type Session = SessionTokens & {
  user: SessionUser;
};
