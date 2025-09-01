import axios from 'axios';
import type { AxiosError } from 'axios';

export interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  username: string;
}

export interface Movie {
  id: string;
  title: string;
  poster_url: string;
  release_year: number;
}

export interface MovieDetails extends Movie {
  synopsis: string;
  director: string;
  genre: string;
  reviews: Review[];
  average_rating: number | string; 
}   
const API_BASE_URL = 'https://movie-review-platform.onrender.com';

export const fetchMovies = async (params?: { search?: string, genre?: string }): Promise<Movie[]> => {
  try {
    
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.genre) {
      queryParams.append('genre', params.genre);
    }

    const response = await axios.get(`${API_BASE_URL}/movies?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw error;
  }
};


export const fetchMovieById = async (id: string): Promise<MovieDetails> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie with id ${id}:`, error);
    throw error;
  }
};

export const loginUser = async (credentials: object) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data; 
  } catch (err) {
    const error = err as AxiosError;
    console.error('Login failed:', error.response?.data);
    throw error.response?.data;
  }
};

export const registerUser = async (credentials: object) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, credentials);
    return response.data; 
  } catch (err) {
    const error = err as AxiosError;
    console.error('Registration failed:', error.response?.data);
    throw error.response?.data;
  }
};

export const postReview = async (movieId: string, reviewData: object, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/movies/${movieId}/reviews`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error('Failed to post review:', error.response?.data);
    throw error.response?.data;
  }
};



export const getWatchlist = async (token: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addToWatchlist = async (movieId: string, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/watchlist/${movieId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const removeFromWatchlist = async (movieId: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/watchlist/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserReviews = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/users/me/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const getAllUsers = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
