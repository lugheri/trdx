
export interface User{
  id:number;
  photo:number;
  name:string;
  mail:string;
  level:number;
  password:string;
  reset:number;
  logged:number;
  status:number;
  createdAt:string;
  updatedAt:string;
}

export interface Student{
  id:number;
  photo:number;
  name:string;
  mail:string;
  level:number;
  password:string;
  reset:number;
  logged:number;
  status:number;
  createdAt:string;
  updatedAt:string;
}

export interface AuthContextType {
  authenticated: boolean | null;
  userData: User | Student | null;
  typeAccess: 'Adm' | 'Student' | null;
}

export interface AuthProviderProps{
  children: React.ReactNode;
}

export interface PrivateProps {
  Item: React.ComponentType; // Tipo do componente Item que será renderizado
  typeAccess: 'Adm' | 'Student';
}

export interface TokenProps {
  userId: number;
  typeAccess: 'Adm' | 'Student';
}