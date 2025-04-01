import { authenticate } from "@loopback/authentication"
import { inject } from "@loopback/core"
import { Filter, FilterExcludingWhere } from "@loopback/repository"
import { get, param, post, put, requestBody, response, RestBindings } from "@loopback/rest"
import { ReservationType } from "shared"
import { Reservation } from "../models"
import { ReservationService } from "../services"
import { TYPES } from "../types"
import { Request } from "../types/request.type"

export class ReservationController {
	constructor(
		@inject(TYPES.ReservationService)
		private reservationService: ReservationService,
	) {}

	@post("/reservations")
	@response(200, {
		description: "Reservation model instance",
	})
	async create(@inject(RestBindings.Http.REQUEST) request: Request, @requestBody() reservation: ReservationType): Promise<Reservation> {
		const user = request?.user
		reservation.userId = user?.id || ""
		return this.reservationService.create(reservation)
	}

	@get("/reservations")
	@response(200, {
		description: "Array of Reservation model instances",
		content: {
			"application/json": {
				schema: {
					type: "array",
				},
			},
		},
	})
	async find(@inject(RestBindings.Http.REQUEST) request: Request, @param.filter(Reservation) filter?: ReservationType): Promise<Reservation[]> {
		const user = request?.user
		return this.reservationService.find(filter, user)
	}

	@get("/reservations/{id}")
	@response(200, {
		description: "Reservation model instance",
	})
	async findById(@param.path.string("id") id: string, @param.filter(Reservation) filter?: ReservationType): Promise<Reservation> {
		return this.reservationService.findOne(id, filter)
	}

	@put("/reservations/{id}")
	@response(204, {
		description: "Reservation PATCH success",
	})
	async updateById(
		@param.path.string("id") id: string,
		@requestBody()
		reservation: ReservationType,
	): Promise<Reservation> {
		return this.reservationService.updateOne(id, reservation)
	}
}
