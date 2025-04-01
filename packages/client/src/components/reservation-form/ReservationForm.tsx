import React from "react"
import { Reservation, ReservationFormProps, ReservationStatus } from "../../types"

export const ReservationForm: React.FC<ReservationFormProps> = ({ reservation, onSubmit, onCancel }) => {
	const [formData, setFormData] = React.useState<Reservation>({
		id: reservation?.id || "",
		guestName: reservation?.guestName || "",
		guestContact: reservation?.guestContact || "",
		arrivalTime: reservation?.arrivalTime || new Date().toISOString().slice(0, 16),
		tableSize: reservation?.tableSize || 2,
		status: reservation?.status || ReservationStatus.PENDING,
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
		onSubmit(formData)
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
			<h2 className="text-xl font-bold mb-4">{reservation ? "修改预订" : "新建预订"}</h2>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
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
					<div>
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
					<div>
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
					<div>
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
				</div>
				<div className="flex flex-col sm:flex-row justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition order-2 sm:order-1"
					>
						取消
					</button>
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition order-1 sm:order-2 mb-2 sm:mb-0"
					>
						{reservation ? "更新" : "创建"}
					</button>
				</div>
			</form>
		</div>
	)
}
