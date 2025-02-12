import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-6 py-12 md:py-16">
      {/* Profile Section */}
      <div className="mb-16">
        <Avatar className="mb-4 h-20 w-20">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
          <AvatarFallback>RI</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base font-medium">Reza Ilmi</h1>
          <p className="text-base text-muted-foreground">Full Stack Developer</p>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-16">
        <h2 className="mb-4 text-base font-medium">About</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Building innovative solutions with a focus on user experience and scalability
        </p>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <h2 className="mb-4 text-base font-medium">Contact</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-[140px_1fr] items-start gap-7">
            <span className="text-base text-muted-foreground">Design Portfolio</span>
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-base text-foreground transition-colors hover:bg-muted"
            >
              portfolio.dev
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[140px_1fr] items-start gap-7">
            <span className="text-base text-muted-foreground">Email</span>
            <Link
              href="mailto:example@email.com"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-base text-foreground transition-colors hover:bg-muted"
            >
              example@email.com
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[140px_1fr] items-start gap-7">
            <span className="text-base text-muted-foreground">LinkedIn</span>
            <Link
              href="https://linkedin.com"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-base text-foreground transition-colors hover:bg-muted"
            >
              rezailmi
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[140px_1fr] items-start gap-7">
            <span className="text-base text-muted-foreground">Twitter</span>
            <Link
              href="https://twitter.com"
              className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0 text-base text-foreground transition-colors hover:bg-muted"
            >
              rezailmi
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section>
        <h2 className="mb-4 text-base font-medium">Work Experience</h2>
        <div className="space-y-12">
          <div className="grid grid-cols-[140px_1fr] items-start gap-8">
            <span className="text-base text-muted-foreground">2022 — Now</span>
            <div>
              <h3 className="text-base font-medium">Senior Developer at Company A</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Led the development of multiple high-impact projects, focusing on scalable
                architecture and modern web technologies.
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-base text-muted-foreground">Project X (2024)</li>
                <li className="text-base text-muted-foreground">Project Y (2023)</li>
                <li className="text-base text-muted-foreground">Project Z (2022)</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-start gap-8">
            <span className="text-base text-muted-foreground">2020 — 2022</span>
            <div>
              <h3 className="text-base font-medium">Developer at Company B</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Spearheaded frontend development initiatives and mentored junior developers.
                Improved application performance and user experience through modern development
                practices.
              </p>
              <p className="mt-2 text-base text-muted-foreground">Lead Developer - Frontend</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
