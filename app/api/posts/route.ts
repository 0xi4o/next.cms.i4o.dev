// import { createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '../../../keystatic.config'

export async function GET(request: Request): Promise<Response> {
	try {
		// const isAuthorized = isAuthorizedRequest(req)
		//
		// if (!isAuthorized)
		//     return Response.json(
		//         { message: 'Invalid authorization header or API key' },
		//         { status: 401 }
		//     )

		// const headers = request.headers
		// const originHeader = headers.get('origin') as string
		// const origin = originHeader ? new URL(originHeader).host : ''

		const reader =
			// origin === '' || origin.startsWith('dev')
			// 	? createReader(process.cwd(), keystaticConfig)
			createGitHubReader(keystaticConfig, {
				repo: '0xi4o/next.cms.i4o.dev',
				token: process.env.GITHUB_PAT,
			})
		if (!reader) {
			throw new Error('Reader not found')
		}
		const allPosts = await reader.collections.posts.all()
		const posts =
			// origin === '' || origin.startsWith('dev')
			// 	? allPosts
			allPosts.filter((post) => !post.entry.draft)

		return new Response(JSON.stringify({ posts }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store, no-cache, must-revalidate',
				Expires: '0',
			},
		})
	} catch (error) {
		// @ts-expect-error: message does exist cuz I know better
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store, no-cache, must-revalidate',
				Expires: '0',
			},
		})
	}
}
