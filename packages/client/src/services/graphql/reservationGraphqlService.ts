import graphql from "../../core/graphql"

export const queryGraphqlReservation = async (vars?: any) => {
	return await graphql(
		`
			query {
				reservations {
					guestContact
					arrivalTime
					guestName
					id
					status
					tableSize
					userId
				}
			}
		`,
		vars,
	)
}

export const queryGraphqlReservations = async (vars?: any) => {
	return await graphql(
		`{
				reservations( id: "${vars?.id || ""}", status: "${vars?.status || ""}", arrivalTime: "${vars?.arrivalTime || ""}" ) {
					guestContact
					arrivalTime
					guestName
					id
					status
					tableSize
					userId
				}
			}
		`,
		vars,
	)
}

export const updateGraphqlReservation = async (vars?: any) => {
	return await graphql(
		`{
				updateReservation(id: "${vars?.id}" , status: "${vars.status}") {
					guestContact
					arrivalTime
					guestName
					id
					status
					tableSize
					userId
				}
			}
		`,
		vars,
	)
}
