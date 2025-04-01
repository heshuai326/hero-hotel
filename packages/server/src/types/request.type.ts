import { Request as RestRequest } from "@loopback/rest"
import { User } from "shared"

export interface Request extends RestRequest {
	user?: User
}
