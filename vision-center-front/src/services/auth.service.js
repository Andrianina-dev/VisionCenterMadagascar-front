class AuthService {
  login() {
    localStorage.setItem("auth", "true");
  }

  logout() {
    localStorage.removeItem("auth");
  }

  isLoggedIn() {
    return localStorage.getItem("auth") === "true";
  }
}

export default new AuthService();
