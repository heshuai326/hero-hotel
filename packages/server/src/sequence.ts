import { inject, injectable } from "@loopback/core"
import { FindRoute, HttpErrors, InvokeMethod, ParseParams, Reject, Response, RestBindings, Send, SequenceHandler } from "@loopback/rest"
import * as jwt from "jsonwebtoken"
import SequenceActions = RestBindings.SequenceActions
import { User } from "shared"
import { Request } from "./types/request.type"

@injectable()
export class JwtSequence implements SequenceHandler {
	constructor(
		@inject("jwt.secret") private secret: string,
		@inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
		@inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
		@inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
		@inject(SequenceActions.SEND) protected send: Send,
		@inject(SequenceActions.REJECT) protected reject: Reject,
	) {}

	async handle(context: { request: Request; response: Response }) {
		try {
			const { request, response } = context
			if (!this.isPublicRoute(request.path)) {
				this.verifyToken(request)
			}

			const route = this.findRoute(request)
			const args = await this.parseParams(request, route)
			const result = await this.invoke(route, args)
			this.send(response, result)
		} catch (err) {
			this.reject(context, err)
		}
	}

	private verifyToken(request: Request) {
		const token = request.headers.authorization?.split(" ")[1]
		if (!token) throw new HttpErrors.Unauthorized("Missing token")

		try {
			request.user = jwt.verify(token, this.secret) as User
		} catch (e) {
			throw new HttpErrors.Unauthorized("Invalid token")
		}
	}

	private isPublicRoute(path: string): boolean {
		const publicRoutes = ["/graphql", "/graphiql", "/login", "/register"]
		return publicRoutes.includes(path)
	}
}
