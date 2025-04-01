import { GraphQLServer, GraphQLServerOptions } from "@loopback/graphql"
import { ApplicationConfig, Main } from "./application"
import { EmployeeResolver } from "./graphql/resolvers/employee.resolver"
export * from "./application"

export async function main(options: ApplicationConfig = {}) {
	const app = new Main(options)
	const server = await app.getServer(GraphQLServer)
	server.resolver(EmployeeResolver)

	await app.boot()
	await app.start()

	const url = app.restServer.url
	console.log(`Server is running at ${url}`)
	console.log(`Try ${url}/ping`)

	return app
}

if (require.main === module) {
	const graphqlCfg: GraphQLServerOptions = {
		asMiddlewareOnly: true,
	}
	// Run the application
	const config = {
		rest: {
			port: +(process.env.PORT ?? 3001),
			host: process.env.HOST || "127.0.0.1",
			// The `gracePeriodForClose` provides a graceful close for http/https
			// servers with keep-alive clients. The default value is `Infinity`
			// (don't force-close). If you want to immediately destroy all sockets
			// upon stop, set its value to `0`.
			// See https://www.npmjs.com/package/stoppable
			gracePeriodForClose: 5000, // 5 seconds
			openApiSpec: {
				// useful when used with OpenAPI-to-GraphQL to locate your application
				setServersFromRequest: true,
			},
			requestSizeLimit: "50mb",
			httpServerOptions: {
				maxHeaderSize: 32768,
			},
		},
		graphql: graphqlCfg,
	}
	main(config).catch((err) => {
		console.error("Cannot start the application.", err)
		process.exit(1)
	})
}
