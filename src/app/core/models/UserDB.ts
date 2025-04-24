export interface UserDB {
  id: string;
  email: string;
  roles: string[];
}

export interface RawUserDB {
  email: string;
  roles: string;
}
