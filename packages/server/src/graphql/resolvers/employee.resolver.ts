import { authenticate } from "@loopback/authentication"
import { inject } from "@loopback/core"
import { Args, Query } from "@loopback/graphql"
import { ReservationType, Role } from "shared"
import { Reservation } from "../../models"
import { ReservationService } from "../../services"
import { TYPES } from "../../types"
import { Request } from "../../types/request.type"
import { GetReservationArgs } from "../types/reservation-args.type"

@authenticate("jwt")
export class EmployeeResolver {
	constructor(
		@inject(TYPES.ReservationService)
		private reservationService: ReservationService,
		@inject.context()
		private resolverContext: { req: Request },
	) {
		console.log("resolverContext", this.resolverContext.req)
		// if (this.resolverContext.req?.user?.role !== Role.EMPLOYEE){
		// 	throw new Error("Unauthorized access")
		// }
	}

	@Query(() => [Reservation])
	async reservations(@Args() args: GetReservationArgs): Promise<Reservation[]> {
		console.log("args", args)
		return this.reservationService.find(args as ReservationType)
	}

	@Query(() => Reservation)
	async reservation(@Args() { id }: GetReservationArgs): Promise<Reservation> {
		return this.reservationService.findOne(id)
	}

	@Query(() => Reservation)
	async updateReservation(@Args() args: GetReservationArgs): Promise<Reservation> {
		return this.reservationService.updateOne(args.id, args as ReservationType)
	}
}
