import { inject } from "@loopback/core"
import { post, requestBody } from "@loopback/rest"
import { LoginInput, LoginOutput } from "shared"
import { RegisterInput } from "shared/input"
import { RegisterOutput } from "shared/output"
import { AuthService } from "../services"
import { TYPES } from "../types"

export class AuthController {
	constructor(
		@inject(TYPES.AuthService)
		private authService: AuthService,
	) {}

	@post("/register")
	async register(
		@requestBody({
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							password: { type: "string", minLength: 6 },
							name: { type: "string" },
							phone: { type: "string", pattern: "^(?:(?:\\+|00)86)?1[3-9]\\d{9}$", errorMessage: "phone number is invalid" },
						},
						required: ["phone", "password"],
					},
				},
			},
		})
		userData: RegisterInput,
	): Promise<RegisterOutput> {
		return this.authService.register(userData)
	}

	@post("/login")
	async login(
		@requestBody({
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							phone: { type: "string" },
							password: { type: "string" },
						},
						required: ["phone", "password"],
					},
				},
			},
		})
		credentials: LoginInput,
	): Promise<LoginOutput> {
		return this.authService.login(credentials)
	}
}
