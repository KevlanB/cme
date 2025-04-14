import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  username: string;
  token: string;
  [key: string]: any; // Permite outras propriedades se necessário
}

let user: User | null = null;

class AuthService {
  async login(
    username: string,
    password: string,
    cb: () => void,
  ): Promise<void> {
    localStorage.removeItem("user");

    const res = await axios.post<User>(`${API_URL}/auth/login`, {
      username,
      password,
    });

    if (res.data) {
      localStorage.setItem("user", JSON.stringify(res.data));
      user = res.data;
      cb();
    }
  }

  async resetPassword(username: string, cb: () => void): Promise<void> {
    try {
      await axios.post(`${API_URL}auth/resetpassword`, { name: username });
      cb();
    } catch (err) {
      console.error(err);
    }
  }

  async confirmPassword(
    username: string,
    verificationCode: string,
    newPassword: string,
  ): Promise<void> {
    await axios.post(`${API_URL}auth/confirmPassword`, {
      name: username,
      verificationCode,
      password: newPassword,
    });
  }

  checkLastLogin(): User | null {
    const userStr = localStorage.getItem("user");

    if (userStr) user = JSON.parse(userStr);

    return user;
  }

  async logout(): Promise<void> {
    localStorage.removeItem("user");

    window.location.href = "/login";

    user = null;
  }

  register(username: string, email: string, password: string): Promise<any> {
    return axios.post(`${API_URL}signup`, {
      username,
      email,
      password,
    });
  }

  getCurrentUser(): User | null {
    if (user == null) {
      const userStr = localStorage.getItem("user");

      if (userStr) user = JSON.parse(userStr);
    }

    return user;
  }
}

export default new AuthService();
