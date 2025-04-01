import { TokenServiceConstants } from "@loopback/authentication-jwt"
import { BindingScope, injectable } from "@loopback/core"
import { repository } from "@loopback/repository"
import { HttpErrors } from "@loopback/rest"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { LoginInput, LoginOutput, RegisterInput, RegisterOutput, Role } from "shared"
import { UserRepository } from "../repositories"

@injectable({ scope: BindingScope.TRANSIENT })
export class AuthService {
	constructor(
		@repository(UserRepository)
		private userRepository: UserRepository,
	) {}

	private JWT_SECRET = TokenServiceConstants.TOKEN_SECRET_VALUE || process.env.JWT_SECRET
	private SALT_ROUNDS = 10
	async register(registerInput: RegisterInput): Promise<RegisterOutput> {
		const exists = await this.userRepository.findOne(registerInput.phone)
		if (exists) throw new HttpErrors.Conflict("user already exists")

		const hashedPassword = await bcrypt.hash(registerInput.password, this.SALT_ROUNDS)
		return this.userRepository.create({
			...registerInput,
			password: hashedPassword,
			role: Role.GUEST,
		})
	}

	async login(credentials: LoginInput): Promise<LoginOutput> {
		const user = await this.userRepository.findOne(credentials.phone)
		if (!user) throw new HttpErrors.Unauthorized("Invalid credentials")

		const isPasswordMatched = bcrypt.compare(credentials.password, user.password ?? "")
		if (!isPasswordMatched) throw new HttpErrors.Unauthorized("Invalid credentials")

		const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, this.JWT_SECRET, { expiresIn: "1h" })
		return { token }
	}
}
