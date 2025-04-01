import { TokenService as JWTService } from "@loopback/authentication"
import { TokenServiceBindings } from "@loopback/authentication-jwt"
import { inject } from "@loopback/core"
import { HttpErrors } from "@loopback/rest"
import { UserProfile } from "@loopback/security"
import jwt from "jsonwebtoken"

export class TokenService implements JWTService {
	constructor(@inject(TokenServiceBindings.TOKEN_SECRET) private secret: string) {}

	async verifyToken(token: string): Promise<UserProfile> {
		try {
			const decoded = jwt.verify(token, this.secret) as UserProfile
			return decoded
		} catch (err) {
			throw new HttpErrors.Unauthorized("Invalid token")
		}
	}

	async generateToken(userProfile: UserProfile): Promise<string> {
		return jwt.sign(userProfile, this.secret, {
			expiresIn: "2h",
		})
	}
}
