import { inject } from "@loopback/core"
import { RegisterOutput, User } from "shared"
import { v4 as uuidv4 } from "uuid"
import { CouchbaseService } from "../services"

export class UserRepository {
	constructor(@inject("service.CouchbaseService") private couchbaseService: CouchbaseService) {}
	async findOne(phone: string): Promise<User> {
		return this.couchbaseService.get(phone)
	}

	async create(user: User): Promise<RegisterOutput> {
		const id = uuidv4()
		const { password, ...safeUser } = await this.couchbaseService.upsert(user.phone, { ...user, id, type: "user" })
		return safeUser
	}
}
