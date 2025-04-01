import React from "react"
import { ForgotPasswordFormProps } from "../../types"

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
	const [email, setEmail] = React.useState<string>("")
	const [error, setError] = React.useState<string>("")
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		if (!email) {
			setError("请输入邮箱地址")
			return
		}

		if (!/\S+@\S+\.\S+/.test(email)) {
			setError("请输入有效的邮箱地址")
			return
		}

		setError("")
		setIsLoading(true)

		// 模拟API请求
		setTimeout(() => {
			setIsLoading(false)
			setIsSuccess(true)
		}, 1500)
	}

	return (
		<div className="form-appear">
			<h2 className="text-3xl font-bold text-center mb-2 text-blue-900">重置密码</h2>
			<p className="text-gray-600 text-center mb-8">
				{isSuccess ? "重置链接已发送到您的邮箱，请查收邮件并按照指引完成密码重置。" : "输入您的邮箱地址，我们将发送密码重置链接给您。"}
			</p>

			{!isSuccess ? (
				<form onSubmit={handleSubmit}>
					<div className="mb-6">
						<label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
							邮箱地址
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								<i className="fas fa-envelope"></i>
							</span>
							<input
								type="email"
								id="resetEmail"
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setEmail(e.target.value)
									setError("")
								}}
								className={`w-full pl-10 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
								placeholder="your.email@example.com"
							/>
						</div>
						{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full btn-primary flex justify-center items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								发送中...
							</>
						) : (
							"发送重置链接"
						)}
					</button>
				</form>
			) : (
				<div className="text-center">
					<div className="mb-6 flex justify-center">
						<div className="rounded-full bg-green-100 p-3">
							<svg
								className="h-6 w-6 text-green-600"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					</div>
					<p className="text-gray-700 mb-6">
						如果您没有收到邮件，请检查垃圾邮件文件夹，或
						<button
							className="text-blue-600 hover:text-blue-800 font-medium"
							onClick={() => {
								setIsSuccess(false)
								handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
							}}
						>
							重新发送
						</button>
					</p>
				</div>
			)}

			<div className="mt-8 text-center">
				<button onClick={onBack} className="font-medium text-blue-600 hover:text-blue-800">
					<i className="fas fa-arrow-left mr-1"></i> 返回登录
				</button>
			</div>
		</div>
	)
}
