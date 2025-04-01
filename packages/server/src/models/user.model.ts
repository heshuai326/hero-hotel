import { Entity, model, property } from "@loopback/repository"
import { Role } from "shared"

@model()
export class User extends Entity {
	@property({
		type: "string",
		id: true,
		index: true,
		generated: true,
	})
	id: string

	@property({
		type: "string",
		require: true,
		jsonSchema: {
			minlength: 6,
		},
	})
	password: string

	@property({
		type: "string",
		required: true,
	})
	name: string

	@property({
		type: "string",
		require: true,
	})
	phone: string

	@property({
		type: "string",
		default: "customer",
	})
	role: Role

	constructor(data?: Partial<User>) {
		super(data)
	}
}
