import { inject } from "@loopback/core"
import { ReservationType } from "shared"
import { v4 as uuidv4 } from "uuid"
import { Reservation } from "../models"
import { CouchbaseService } from "../services"

export class ReservationRepository {
	bucketName = "hotel-bucket"
	constructor(@inject("service.CouchbaseService") private couchbaseService: CouchbaseService) {}

	async findOne(id: string): Promise<Reservation> {
		return this.couchbaseService.get(id)
	}

	async create(reservation: ReservationType): Promise<Reservation> {
		const id = uuidv4()
		// @ts-ignore
		return this.couchbaseService.upsert(id, { ...reservation, id, type: "reservation" })
	}

	async find(queryParams?: ReservationType): Promise<Reservation[]> {
		console.log("queryParams")
		console.log(queryParams)
		let query = `
        SELECT META().id as id, r.*
        FROM \`${this.bucketName}\`.\`_default\`.\`_default\` AS r
        WHERE r.type = 'reservation'
    `
		const conditions: string[] = []
		const parameters: any = {}

		if (queryParams?.id) {
			conditions.push("r.id = $id")
			parameters.id = queryParams.id
		}

		if (queryParams?.guestName) {
			conditions.push("r.guestName LIKE $guestName")
			parameters.guestName = `%${queryParams.guestName}%`
		}

		if (queryParams?.guestContact) {
			conditions.push("r.guestContact = $guestContact")
			parameters.guestContact = queryParams.guestContact
		}

		if (queryParams?.status) {
			conditions.push("r.status = $status")
			parameters.status = queryParams.status
		}

		if (queryParams?.userId) {
			conditions.push("r.userId = $userId")
			parameters.userId = queryParams.userId
		}

		if (queryParams?.arrivalTime) {
			conditions.push("r.arrivalTime > $arrivalTime")
			parameters.arrivalTime = queryParams.arrivalTime
		}

		if (conditions.length > 0) {
			query += " AND " + conditions.join(" AND ")
		}

		query += " ORDER BY r.arrivalTime DESC LIMIT 100"

		const options = {
			parameters: parameters,
		}

		console.log("query is: ")
		console.log(query)
		console.log("options is: ")
		console.log(options)
		console.log("conditions is: ")
		console.log(conditions)

		try {
			const result = await this.couchbaseService.query(query, options)
			return result.rows
		} catch (error) {
			console.error("Error executing reservation query:", error)
			throw new Error("Failed to retrieve reservations")
		}
	}

	async updateOne(id: string, reservation: ReservationType): Promise<Reservation> {
		const existing = await this.couchbaseService.get(id)
		if (!existing) {
			throw new Error(`Reservation with id ${id} not found`)
		}

		return this.couchbaseService.upsert(id, { ...existing, ...reservation })
	}
}
