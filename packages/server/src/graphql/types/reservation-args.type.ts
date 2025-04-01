import { ArgsType, Field, ID } from "@loopback/graphql"
import { ReservationStatus } from "shared"

@ArgsType()
export class GetReservationArgs {
	@Field(() => ID, { nullable: true })
	id: string

	@Field({ nullable: true })
	status?: ReservationStatus

	@Field({ nullable: true })
	guestName?: string

	@Field({ nullable: true })
	guestContact?: string

	@Field({ nullable: true })
	arrivalTime?: string

	@Field({ nullable: true })
	tableSize?: number
}
