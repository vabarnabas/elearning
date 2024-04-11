import Cookies from "universal-cookie"

class TokenService {
  constructor(private token: string) {}

  public async saveToken(token: string): Promise<void> {
    const cookies = new Cookies()
    cookies.set(this.token, token, { path: "/" })
  }

  public async deleteToken(): Promise<void> {
    const cookies = new Cookies()
    cookies.remove(this.token, { path: "/" })
  }

  public getToken(): Promise<any> {
    const cookies = new Cookies()
    return cookies.get(this.token)
  }
}

export default TokenService
