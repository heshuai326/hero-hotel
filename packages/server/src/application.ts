import { AuthenticationComponent } from "@loopback/authentication"
import { BootMixin } from "@loopback/boot"
import { ApplicationConfig } from "@loopback/core"
import { GraphQLBindings, GraphQLComponent } from "@loopback/graphql"
import { RepositoryMixin } from "@loopback/repository"
import { RestApplication } from "@loopback/rest"
import { RestExplorerBindings, RestExplorerComponent } from "@loopback/rest-explorer"
import { ServiceMixin } from "@loopback/service-proxy"
import { JWTAuthenticationComponent } from "./components/jwt-authentication.component"
import { EmployeeResolver } from "./graphql/resolvers/employee.resolver"
import { AuthService, CouchbaseService, ReservationService } from "./services"
import { TYPES } from "./types"
import {dbConfig} from "./config/db.config";

export { ApplicationConfig }

export class Main extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
	constructor(options: ApplicationConfig = {}) {
		super(options)

		this.component(AuthenticationComponent)

		this.component(JWTAuthenticationComponent)

		this.bind(TYPES.CouchbaseService).toClass(CouchbaseService)
		this.bind(TYPES.AuthService).toClass(AuthService)
		this.bind(TYPES.ReservationService).toClass(ReservationService)

		this.bind(TYPES.CouchbaseConfig).to({...dbConfig})

		this.component(GraphQLComponent)

		this.bind(TYPES.EmployeeResolver).toClass(EmployeeResolver)

		const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER)

		server.middleware((resolverData, next) => {
			return next()
		})

		this.expressMiddleware("middleware.express.GraphQL", server.expressApp)

		this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to((context) => {
			return { ...context }
		})

		this.configure(RestExplorerBindings.COMPONENT).to({
			path: "/explorer",
		})
		this.component(RestExplorerComponent)

		this.projectRoot = __dirname

		this.bootOptions = {
			graphqlResolvers: {
				dirs: ["graphql-resolvers"],
				extensions: [".js"],
				nested: true,
			},
			controllers: {
				dirs: ["controllers"],
				extensions: [".controller.js"],
				nested: true,
			},
		}
	}
}
