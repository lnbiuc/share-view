module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {
			overrideBrowserslist: [
				'Android 4.1',
				'iOS 7.1',
				'Chrome > 31',
				'ff > 31',
				'> 1%',
				"last 1 chrome version",
				"last 1 firefox version",
				"last 1 safari version",
				"last 1 ie version"
			],
			grid: true,
		},
    },
};
