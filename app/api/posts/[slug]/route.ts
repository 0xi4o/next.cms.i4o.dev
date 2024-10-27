// import { createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import invariant from 'tiny-invariant'
import keystaticConfig from '../../../../keystatic.config'
import Markdoc from '@markdoc/markdoc'
// import { isAuthorizedRequest } from '@/lib/utils'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
	const slug = (await params).slug
	invariant(slug, '`slug` is missing. Please check your URL.')

	try {
		// const isAuthorized = isAuthorizedRequest(req)
		//
		// if (!isAuthorized)
		//     return Response.json(
		//         { message: 'Invalid authorization header or API key' },
		//         { status: 401 }
		//     )

		// const originHeader = headers.get('origin') as string
		// const headers = request.headers
		// const origin = originHeader ? new URL(originHeader).host : ''
		//
		const reader =
			// origin === '' || origin.startsWith('dev')
			// 	? createReader(process.cwd(), keystaticConfig)
			createGitHubReader(keystaticConfig, {
				repo: '0xi4o/next.cms.i4o.dev',
				token: process.env.GITHUB_PAT,
			})
		const post = await reader.collections.posts.read(slug, {
			resolveLinkedFiles: true,
		})
		if (!post) {
			return new Response(JSON.stringify({ message: 'not_found' }))
		}
		// if (post.draft) {
		// 	if (origin === '' || origin.startsWith('dev')) {
		// 		return new Response(JSON.stringify({ post, slug }))
		// 	}
		// }
		const errors = Markdoc.validate(post.content.node, {})
		if (errors.length) {
			console.error(errors)
			throw new Error('Invalid content')
		}
		const content = Markdoc.transform(post.content.node, {})

		return new Response(
			JSON.stringify({ post: { ...post, content }, slug }),
		)
	} catch (error) {
		// @ts-expect-error: message does exist cuz I know better
		return new Response(JSON.stringify({ message: error.message }))
	}
}
