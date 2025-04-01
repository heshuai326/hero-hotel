import { registerAuthenticationStrategy } from "@loopback/authentication"
import { JWTAuthenticationStrategy, TokenServiceBindings, TokenServiceConstants } from "@loopback/authentication-jwt"
import { Application, Binding, Component, CoreBindings, inject } from "@loopback/core"
import { TokenService } from "../services"

export class JWTAuthenticationComponent implements Component {
	bindings: Binding[] = [
		Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE || process.env.JWT_SECRET),
		Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE),
		Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(TokenService),
	]
	constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
		registerAuthenticationStrategy(app, JWTAuthenticationStrategy)
	}
}
