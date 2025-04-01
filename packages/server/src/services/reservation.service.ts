import { BindingScope, injectable } from "@loopback/core"
import { repository } from "@loopback/repository"
import { ReservationStatus, ReservationType, User } from "shared"
import { Reservation } from "../models"
import { ReservationRepository } from "../repositories"

export const mockReservation: Reservation = new Reservation({
	id: "1",
	guestName: "John Doe",
	guestContact: "1234567890",
	arrivalTime: "",
	tableSize: 5,
	status: ReservationStatus.PENDING,
	userId: "1",
})

@injectable({ scope: BindingScope.TRANSIENT })
export class ReservationService {
	constructor(
		@repository(ReservationRepository)
		private reservationRepository: ReservationRepository,
	) {}

	async create(reservation: ReservationType): Promise<Reservation> {
		return this.reservationRepository.create(reservation)
	}

	async find(filter?: ReservationType, user?: User): Promise<Reservation[]> {
		if (user) {
			filter = new Reservation({
				...filter,
				userId: user.id,
			})
		}
		return this.reservationRepository.find(filter)
	}

	async findOne(id: string, filter?: ReservationType): Promise<Reservation> {
		// return Promise.resolve(mockReservation)
		return this.reservationRepository.findOne(id)
	}

	async updateOne(id: string, updateOne: ReservationType): Promise<Reservation> {
		return this.reservationRepository.updateOne(id, updateOne)
	}
}
