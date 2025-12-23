/** @type {import('next').NextConfig} */
const nextConfig = {
  // Include the _content directory in the serverless function bundle
  outputFileTracingIncludes: {
    '/notes/[slug]': ['_content/notes/**/*'],
    '/works/[slug]': ['_content/works/**/*'],
    '/notes': ['_content/notes/**/*'],
    '/works': ['_content/works/**/*'],
  },
}

export default nextConfig
