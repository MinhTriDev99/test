import { API } from "./api";

export const GetUserApi = `${API}/users`;
export const DeleteUserApi = (id:string) => `${API}/users/${id}`;
export const AddUserApi = `${API}/users`;
export const EditUserApi =(id:string)=> `${API}/users/${id}`;