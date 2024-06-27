const API_URL = process.env.API_URL || 'http://localhost:3001'

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${API_URL}/:path*`,
			},
		]
	},
}

module.exports = nextConfig
