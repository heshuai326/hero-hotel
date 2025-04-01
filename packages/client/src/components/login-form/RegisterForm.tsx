import React from "react"
import { FormErrors, RegisterFormProps } from "../../types"
import { register } from "../../services"
import { RegisterInput } from "shared"
export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
	const [formData, setFormData] = React.useState<RegisterInput>({
		phone: "",
		password: "",
		confirmPassword: "",
		agreeTerms: false,
	})

	const [errors, setErrors] = React.useState<FormErrors>({})
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, type, checked } = e.target
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		})

		// 清除错误提示
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: null,
			})
		}
	}

	const validate = (): boolean => {
		const newErrors: FormErrors = {}

		if (!formData.phone) {
			newErrors.phone = "请输入手机号"
		} else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(formData.phone)) {
			newErrors.phone = "请输入有效的手机号"
		}

		if (!formData.password) {
			newErrors.password = "请输入密码"
		} else if (formData.password.length < 6) {
			newErrors.password = "密码至少需要6个字符"
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "两次输入的密码不一致"
		}

		if (!formData.agreeTerms) {
			newErrors.agreeTerms = "请同意使用条款和隐私政策"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (validate()) {
			setIsLoading(true)

			const res = await register(formData)
			alert("注册成功")
		}
		setIsLoading(false)
	}

	return (
		<div className="form-appear">
			<h2 className="text-3xl font-bold text-center mb-2 text-blue-900">创建账户</h2>
			<p className="text-gray-600 text-center mb-8">加入希尔顿荣誉客会，享受更多优惠</p>

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
						手机号
					</label>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
							<i className="fas fa-envelope"></i>
						</span>
						<input
							type="phoneNuber"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className={`w-full pl-10 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
							placeholder="请输入手机号"
						/>
					</div>
					{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
				</div>

				<div className="mb-4">
					<label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
						密码
					</label>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
							<i className="fas fa-lock"></i>
						</span>
						<input
							type="password"
							id="registerPassword"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={`w-full pl-10 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
							placeholder="••••••••"
						/>
					</div>
					{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
					<p className="mt-1 text-xs text-gray-500">密码至少需要6个字符</p>
				</div>

				<div className="mb-6">
					<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
						确认密码
					</label>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
							<i className="fas fa-lock"></i>
						</span>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={`w-full pl-10 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
							placeholder="••••••••"
						/>
					</div>
					{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
				</div>

				<div className="mb-6">
					<div className="flex items-start">
						<div className="flex items-center h-5">
							<input
								id="agreeTerms"
								name="agreeTerms"
								type="checkbox"
								checked={formData.agreeTerms}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
						</div>
						<div className="ml-3 text-sm">
							<label htmlFor="agreeTerms" className="font-medium text-gray-700">
								我同意希尔顿的
								<a href="#" className="text-blue-600 hover:text-blue-800">
									{" "}
									使用条款{" "}
								</a>
								和
								<a href="#" className="text-blue-600 hover:text-blue-800">
									{" "}
									隐私政策
								</a>
							</label>
						</div>
					</div>
					{errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
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
							注册中...
						</>
					) : (
						"注册"
					)}
				</button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-sm text-gray-600">
					已有账户?{" "}
					<button onClick={onToggleForm} className="font-medium text-blue-600 hover:text-blue-800">
						立即登录
					</button>
				</p>
			</div>
		</div>
	)
}
