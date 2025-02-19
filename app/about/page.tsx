import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      {/* Profile Section */}
      <div className="mb-12 sm:mb-16">
        <Avatar className="mb-4 h-16 w-16 sm:h-20 sm:w-20">
          <AvatarFallback>RI</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-medium">Reza Ilmi</h1>
          <p className="text-muted-foreground">Software designer + engineer</p>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="mb-3 text-base font-medium">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Building innovative solutions with a focus on user experience and scalability
        </p>
      </section>

      {/* Contact Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="mb-3 text-base font-medium">Contact</h2>
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
        <h2 className="mb-3 text-base font-medium">Work Experience</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2021 — Present</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">
                Senior Product Designer at Hyphen Group
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Led the design systems team for 6 markets at a leading fintech company in Southeast
                Asia with over 10 million monthly users. Focused on unifying the experience and
                improving development efficiency for both designers and tech teams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2019 — 2021</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">Senior Product Designer at SOL X</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Led Watch & Wearable product design at an IoT Marine-Tech Startup incubated at BCG
                Digital Ventures. Worked with Head of Product & Product Managers to define product
                vision and concept. Increased development efficiency by developing design systems
                for entire product line.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2016 — 2019</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">
                Senior User Interface Designer at Traveloka
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Built digital solutions and managed business unit&apos;s design system at a leading
                Southeast Asia online travel company. Redesigned payment experience across multiple
                platforms and markets. Improved Traveloka PayLater, increasing activation by 342% in
                3.5 months.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">2014 — 2016</span>
            <div>
              <h3 className="text-base font-medium sm:text-lg">
                Co-founder & Product Designer at CharityLights
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Part-time role as co-founder and product designer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <span className="text-sm text-muted-foreground sm:text-base">Earlier Roles</span>
            <div>
              <ul className="space-y-2">
                <li>
                  <h3 className="text-base font-medium sm:text-lg">UI Designer at Mivo</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">2015 — 2016, Jakarta</p>
                </li>
                <li>
                  <h3 className="text-base font-medium sm:text-lg">
                    UI/UX Design Intern at Microsoft
                  </h3>
                  <p className="text-sm text-muted-foreground sm:text-base">2014, Jakarta</p>
                </li>
                <li>
                  <h3 className="text-base font-medium sm:text-lg">Web Designer at NoLimit</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">2012 — 2013, Bandung</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
