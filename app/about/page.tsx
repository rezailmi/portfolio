import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      {/* Profile Section */}
      <div className="mb-12 sm:mb-16">
        <Avatar className="mb-4 h-16 w-16 sm:h-20 sm:w-20">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
          <AvatarFallback>RI</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-medium sm:text-xl">Reza Ilmi</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Software designer + engineer</p>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="mb-3 text-lg font-medium sm:mb-4 sm:text-xl">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Building innovative solutions with a focus on user experience and scalability
        </p>
      </section>

      {/* Contact Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="mb-3 text-lg font-medium sm:mb-4 sm:text-xl">Contact</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] items-start gap-2 sm:grid-cols-[140px_1fr] sm:gap-7">
            <span className="text-sm text-muted-foreground sm:text-base">Portfolio</span>
            <Link
              href="https://rezailmi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-sm text-foreground transition-colors hover:bg-muted sm:text-base"
            >
              rezailmi.com
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-2 sm:grid-cols-[140px_1fr] sm:gap-7">
            <span className="text-sm text-muted-foreground sm:text-base">Email</span>
            <Link
              href="mailto:hi.rezailmi@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-sm text-foreground transition-colors hover:bg-muted sm:text-base"
            >
              hi.rezailmi@gmail.com
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-2 sm:grid-cols-[140px_1fr] sm:gap-7">
            <span className="text-sm text-muted-foreground sm:text-base">LinkedIn</span>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-sm text-foreground transition-colors hover:bg-muted sm:text-base"
            >
              rezailmi
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-2 sm:grid-cols-[140px_1fr] sm:gap-7">
            <span className="text-sm text-muted-foreground sm:text-base">Twitter</span>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-sm text-foreground transition-colors hover:bg-muted sm:text-base"
            >
              rezailmi
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section>
        <h2 className="mb-3 text-lg font-medium sm:mb-4 sm:text-xl">Work Experience</h2>
        <div className="space-y-8 sm:space-y-12">
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2022 — Now</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">Senior Developer at Company A</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Led the development of multiple high-impact projects, focusing on scalable
                architecture and modern web technologies.
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-muted-foreground sm:text-base">Project X (2024)</li>
                <li className="text-sm text-muted-foreground sm:text-base">Project Y (2023)</li>
                <li className="text-sm text-muted-foreground sm:text-base">Project Z (2022)</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2020 — 2022</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">Developer at Company B</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Spearheaded frontend development initiatives and mentored junior developers.
                Improved application performance and user experience through modern development
                practices.
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Lead Developer - Frontend
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
