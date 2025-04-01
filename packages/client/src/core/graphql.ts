import { core } from "./core"

const graphql = (query: string, variables: any) => {
	return core.post("/graphql", {
		query,
		variables,
	})
}

export default graphql
