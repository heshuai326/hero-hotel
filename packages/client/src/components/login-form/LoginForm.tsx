import React from "react"
import { useNavigate } from "react-router-dom"
import { FormErrors, LoginFormProps } from "../../types"
import { login } from "../../services"
import { LoginInput } from "shared"

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onForgotPassword }) => {
	const navigate = useNavigate()
	const [formData, setFormData] = React.useState<LoginInput>({
		phone: "",
		password: "",
		rememberMe: false,
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

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (validate()) {
			setIsLoading(true)
			const res = await login(formData)
			localStorage.setItem("token", (res as any)?.token)
			navigate("/home")
		}
		setIsLoading(false)
	}

	return (
		<div className="form-appear">
			<h2 className="text-3xl font-bold text-center mb-2 text-blue-900">欢迎回来</h2>
			<p className="text-gray-600 text-center mb-8">登录您的希尔顿荣誉客会账户</p>

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
						手机号
					</label>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
							<i className="fas fa-envelope"></i>
						</span>
						<input
							type="phoneNumber"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className={`w-full pl-10 py-2 border ${errors.phpne ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
							placeholder="请输入手机号"
						/>
					</div>
					{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
				</div>

				<div className="mb-6">
					<div className="flex justify-between items-center mb-1">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							密码
						</label>
						<button type="button" onClick={onForgotPassword} className="text-sm text-blue-600 hover:text-blue-800">
							忘记密码?
						</button>
					</div>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
							<i className="fas fa-lock"></i>
						</span>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={`w-full pl-10 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm input-focus`}
							placeholder="••••••••"
						/>
					</div>
					{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
				</div>

				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center">
						<input
							type="checkbox"
							id="rememberMe"
							name="rememberMe"
							checked={formData.rememberMe}
							onChange={handleChange}
							className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
							记住我
						</label>
					</div>
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
							登录中...
						</>
					) : (
						"登录"
					)}
				</button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-sm text-gray-600">
					还没有账户?{" "}
					<button onClick={onToggleForm} className="font-medium text-blue-600 hover:text-blue-800">
						立即注册
					</button>
				</p>
			</div>
		</div>
	)
}
