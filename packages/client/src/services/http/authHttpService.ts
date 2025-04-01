import { http } from "../../core"
import { LoginInput, LoginOutput, RegisterInput, RegisterOutput } from "shared"

export const login = (data: LoginInput): Promise<LoginOutput> => {
	return http.post("/login", data)
}

export const register = (data: RegisterInput): Promise<RegisterOutput> => {
	return http.post("/register", data)
}
