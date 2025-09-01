// import axios, { AxiosResponse } from 'axios';

// const API = process.env.NEXT_PUBLIC_API_BASE_URL;



// // User registration data
// export type RegisterData = {
//   name: string;
//   email: string;
//   password: string;
// };

// // User login data
// export type LoginData = {
//   email: string;
//   password: string;
// };

// // Auth API response
// export type AuthResponse = {
//   token: string; // JWT token
//   user?: {
//     name: string;
//     email: string;
//   };
// };

// // Booking data
// export type BookSlotData = {
//   name: string;
//   email: string;
//   phone: string;
//   courtId: string;
//   date: string;
//   start: string;
//   end: string;
// };

// // Booking API response
// export type BookSlotResponse = {
//   message: string;
//   slotId?: string; // optional: ID of booked slot
// };

// // Slot type
// export type Slot = {
//   _id: string;
//   courtId: string;
//   date: string;
//   start: string;
//   end: string;
//   status: 'available' | 'booked';
//   price?: number;
// };


// // Register user
// export const registerUser = async (
//   data: RegisterData
// ): Promise<AxiosResponse<AuthResponse>> => {
//   return axios.post<AuthResponse>(`${API}/auth/register`, data);
// };

// // Login user
// export const loginUser = async (
//   data: LoginData
// ): Promise<AxiosResponse<AuthResponse>> => {
//   return axios.post<AuthResponse>(`${API}/auth/login`, data);
// };

// // Book a slot (requires JWT token)
// export const bookSlotAPI = async (
//   data: BookSlotData,
//   token: string
// ): Promise<AxiosResponse<BookSlotResponse>> => {
//   return axios.post<BookSlotResponse>(`${API}/book`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Fetch available slots
// export const fetchSlotsAPI = async (
//   courtId: string,
//   date: string
// ): Promise<AxiosResponse<Slot[]>> => {
//   const qs = new URLSearchParams({ courtId, date }).toString();
//   return axios.get<Slot[]>(`${API}/slots?${qs}`);
// };

import axios, { AxiosResponse } from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;


export type RegisterData = {
  name: string;
  email: string;
  password: string;
};


export type LoginData = {
  email: string;
  password: string;
};


export type AuthResponse = {
  token?: string;        
  accessToken?: string; 
  user?: {
    name: string;
    email: string;
  };
};


export type BookSlotData = {
  name: string;
  email: string;
  phone: string;
  courtId: string;
  date: string;
  start: string;
  end: string;
};


export type BookSlotResponse = {
  message: string;
  slotId?: string; // optional: ID of booked slot
};


export type Slot = {
  _id: string;
  courtId: string;
  date: string;
  start: string;
  end: string;
  status: 'available' | 'booked';
  price?: number;
};


export const registerUser = async (
  data: RegisterData
): Promise<AxiosResponse<AuthResponse>> => {
  return axios.post<AuthResponse>(`${API}/auth/register`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
};


export const loginUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  return axios.post<AuthResponse>(`${API}/auth/login`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
};


export const bookSlotAPI = async (
  data: BookSlotData,
  token: string
): Promise<AxiosResponse<BookSlotResponse>> => {
  return axios.post<BookSlotResponse>(`${API}/book`, data, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
};


export const fetchSlotsAPI = async (
  courtId: string,
  date: string
): Promise<AxiosResponse<Slot[]>> => {
  const qs = new URLSearchParams({ courtId, date }).toString();
  return axios.get<Slot[]>(`${API}/slots?${qs}`);
};
