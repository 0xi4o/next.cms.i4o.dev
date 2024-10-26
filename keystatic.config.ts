import { collection, config, fields, singleton } from '@keystatic/core'

const TAG_OPTIONS = [
	{ label: 'side-projects', value: 'side-projects' },
	{ label: 'workflow', value: 'workflow' },
	{ label: 'productivity', value: 'productivity' },
	{ label: 'learning', value: 'learning' },
	{ label: 'local-first', value: 'local-first' },
	{ label: 'opinion', value: 'opinion' },
	{ label: 'typescript', value: 'typescript' },
	{ label: 'remix', value: 'remix' },
	{ label: 'react', value: 'react' },
	{
		label: 'golang',
		value: 'golang',
	},
	{
		label: 'rust',
		value: 'rust',
	},
	{ label: 'books', value: 'books' },
	{ label: 'journal', value: 'journal' },
	{ label: 'open-source', value: 'open-source' },
]

export default config({
	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/*',
			entryLayout: 'content',
			format: { contentField: 'content' },
			columns: ['draft', 'date_updated', 'date_published'],
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				excerpt: fields.text({ label: 'Excerpt', multiline: true }),
				series: fields.relationship({
					label: 'Series',
					collection: 'series',
				}),
				tags: fields.multiselect({
					label: 'Tags',
					options: TAG_OPTIONS,
				}),
				date_published: fields.date({ label: 'Published Date' }),
				date_updated: fields.date({ label: 'Updated Date' }),
				draft: fields.checkbox({ label: 'Draft' }),
				featured: fields.checkbox({ label: 'Feature this post?' }),
				content: fields.markdoc({
					label: 'Content',
				}),
			},
		}),
		bookNotes: collection({
			label: 'Book Notes',
			slugField: 'title',
			path: 'src/content/book-notes/*',
			entryLayout: 'content',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				author: fields.text({ label: 'Author' }),
				tags: fields.multiselect({
					label: 'Tags',
					options: TAG_OPTIONS,
				}),
				date_published: fields.date({ label: 'Published Date' }),
				date_updated: fields.date({ label: 'Updated Date' }),
				draft: fields.checkbox({ label: 'Draft' }),
				featured: fields.checkbox({ label: 'Feature this book note?' }),
				content: fields.markdoc({
					label: 'Content',
				}),
			},
		}),
		series: collection({
			label: 'Series',
			slugField: 'title',
			path: 'src/content/series/*',
			entryLayout: 'content',
			format: { contentField: 'excerpt' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				excerpt: fields.markdoc({
					label: 'Excerpt',
				}),
				tags: fields.multiselect({
					label: 'Tags',
					options: TAG_OPTIONS,
				}),
				date_published: fields.date({ label: 'Published Date' }),
				date_updated: fields.date({ label: 'Updated Date' }),
				status: fields.select({
					label: 'Status',
					options: [
						{ label: 'Ongoing', value: 'ongoing' },
						{ label: 'Completed', value: 'completed' },
					],
					defaultValue: 'ongoing',
				}),
			},
		}),
	},
	singletons: {
		// ------------------------------
		// Books
		// ------------------------------
		books: singleton({
			label: 'Books',
			path: 'src/content/books',
			format: { data: 'json' },
			schema: {
				read: fields.array(
					fields.object({
						groupName: fields.text({ label: 'Group Name' }),
						items: fields.array(
							fields.object({
								label: fields.text({
									label: 'Book Title',
								}),
								author: fields.text({
									label: 'Author',
								}),
								cover: fields.file({
									label: 'Book Cover',
								}),
								genre: fields.select({
									label: 'Genre',
									options: [
										{
											label: 'Anthropology',
											value: 'anthropology',
										},
										{
											label: 'Business & Startups',
											value: 'business-startups',
										},
										{ label: 'Classic', value: 'classic' },
										{
											label: 'Comics & Graphic Novels',
											value: 'comics-graphic-novels',
										},
										{ label: 'Fantasy', value: 'fantasy' },
										{
											label: 'History',
											value: 'history',
										},
										{
											label: 'Philosophy',
											value: 'philosophy',
										},
										{
											label: 'Productivity',
											value: 'productivity',
										},
										{ label: 'SciFi', value: 'scifi' },
										{
											label: 'Self Help',
											value: 'selfhelp',
										},
									],
									defaultValue: 'scifi',
								}),
							}),
							{
								itemLabel: (props) => props.fields.label.value,
							},
						),
					}),
					{
						label: 'Group Name',
						itemLabel: (props) => props.fields.groupName.value,
					},
				),
			},
		}),
	},
	storage: {
		// kind: 'local',
		kind: 'github',
		repo: {
			owner: '0xi4o',
			name: 'cms.i4o.dev',
		},
	},
})
