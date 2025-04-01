import { Field, ID, ObjectType } from "@loopback/graphql"
import { Entity, model, property } from "@loopback/repository"
import { ReservationStatus } from "shared"

@model()
@ObjectType()
export class Reservation extends Entity {
	@property({
		type: "string",
		id: true,
		index: true,
		generated: true,
	})
	@Field(() => ID)
	id: string

	@property({
		type: "string",
		required: true,
	})
	@Field()
	guestName: string

	@property({
		type: "string",
		required: true,
	})
	@Field()
	guestContact: string

	@property({
		type: "string",
		required: true,
	})
	@Field()
	arrivalTime: string

	@property({
		type: "number",
		required: true,
		jsonSchema: {
			minimum: 1,
			maximum: 20,
		},
	})
	@Field()
	tableSize: number

	@property({
		type: "string",
		default: "pending",
	})
	@Field()
	status: ReservationStatus

	@property({
		type: "string",
	})
	@Field()
	userId: string

	constructor(data?: Partial<Reservation>) {
		super(data)
	}
}
