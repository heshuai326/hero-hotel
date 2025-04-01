import React from "react"
import { Reservation, ReservationDetailFormProps, ReservationStatus } from "../../types"

export const ReservationDetailForm: React.FC<ReservationDetailFormProps> = ({ reservation, onUpdate, onUpdateStatus }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)
	const [formData, setFormData] = React.useState<Reservation>({
		id: reservation.id,
		guestName: reservation.guestName,
		guestContact: reservation.guestContact,
		arrivalTime: reservation.arrivalTime,
		tableSize: reservation.tableSize,
		status: reservation.status,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: name === "tableSize" ? parseInt(value) : value,
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		onUpdate(formData)
		setIsEditing(false)
	}

	return (
		<div>
			{isEditing ? (
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
						<input
							type="text"
							name="guestName"
							value={formData.guestName}
							onChange={handleChange}
							required
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
						<input
							type="text"
							name="guestContact"
							value={formData.guestContact}
							onChange={handleChange}
							required
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">到达时间</label>
						<input
							type="datetime-local"
							name="arrivalTime"
							value={formData.arrivalTime}
							onChange={handleChange}
							required
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">人数</label>
						<select
							name="tableSize"
							value={formData.tableSize}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((size) => (
								<option key={size} value={size}>
									{size}人
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col sm:flex-row justify-end gap-2">
						<button
							type="button"
							onClick={() => setIsEditing(false)}
							className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition order-2 sm:order-1"
						>
							取消
						</button>
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition order-1 sm:order-2 mb-2 sm:mb-0"
						>
							保存
						</button>
					</div>
				</form>
			) : (
				<div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
						<div>
							<p className="text-sm text-gray-500">预订ID</p>
							<p className="font-medium">{reservation.id}</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">状态</p>
							<p
								className={`font-medium
                ${
					reservation.status === ReservationStatus.CONFIRMED
						? "text-green-600"
						: reservation.status === ReservationStatus.PENDING
							? "text-yellow-600"
							: reservation.status === ReservationStatus.COMPLETED
								? "text-blue-600"
								: "text-red-600"
				}`}
							>
								{reservation.status}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">姓名</p>
							<p className="font-medium">{reservation.guestName}</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">联系方式</p>
							<p className="font-medium">{reservation.guestContact}</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">到达时间</p>
							<p className="font-medium">{new Date(reservation.arrivalTime).toLocaleString()}</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">人数</p>
							<p className="font-medium">{reservation.tableSize}人</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2 justify-between">
						<button
							onClick={() => setIsEditing(true)}
							className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
						>
							编辑
						</button>

						<div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
							{reservation.status === ReservationStatus.PENDING && (
								<button
									onClick={() => onUpdateStatus(reservation.id, ReservationStatus.CONFIRMED)}
									className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
								>
									确认
								</button>
							)}
							{(reservation.status === ReservationStatus.CONFIRMED || reservation.status === ReservationStatus.PENDING) && (
								<>
									<button
										onClick={() => onUpdateStatus(reservation.id, ReservationStatus.COMPLETED)}
										className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
									>
										完成
									</button>
									<button
										onClick={() => onUpdateStatus(reservation.id, ReservationStatus.CANCELED)}
										className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
									>
										取消
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
