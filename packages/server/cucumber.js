module.exports = {
	default: {
		paths: ["__tests__/**/*.feature"],
		requireModule: ["ts-node/register"],
		require: ["__tests__/features/**/*.ts"],
		format: ["progress-bar", "html:cucumber-report.html"],
		parallel: 2,
	},
}
