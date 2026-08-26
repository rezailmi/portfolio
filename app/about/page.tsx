import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { font, leading, mq } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  page: {
    flex: '1',
    marginInline: 'auto',
    maxWidth: '42rem',
    paddingBlock: { default: '2rem', [mq.sm]: '3rem', [mq.md]: '4rem' },
    paddingInline: { default: '1rem', [mq.sm]: '1.5rem' },
  },
  profile: {
    marginBottom: { default: '3rem', [mq.sm]: '4rem' },
  },
  avatar: {
    height: { default: '4rem', [mq.sm]: '5rem' },
    marginBottom: '1rem',
    width: { default: '4rem', [mq.sm]: '5rem' },
  },
  name: {
    fontSize: { default: font.base, [mq.sm]: font.lg },
    fontWeight: 500,
    lineHeight: { default: leading.base, [mq.sm]: leading.lg },
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
  },
  section: {
    marginBottom: { default: '3rem', [mq.sm]: '4rem' },
  },
  heading: {
    fontSize: font.base,
    fontWeight: 500,
    lineHeight: leading.base,
    marginBottom: '0.75rem',
  },
  aboutText: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: 1.625,
    marginBottom: '1rem',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  row: {
    alignItems: 'start',
    display: 'grid',
    gap: { default: '0.5rem', [mq.sm]: '1.75rem' },
    gridTemplateColumns: { default: '100px 1fr', [mq.sm]: '140px 1fr' },
  },
  jobRow: {
    alignItems: 'start',
    display: 'grid',
    gap: { default: '0.75rem', [mq.sm]: '2rem' },
    gridTemplateColumns: { default: '1fr', [mq.sm]: '140px 1fr' },
  },
  link: {
    alignItems: 'center',
    borderRadius: radius.md,
    color: colors.foreground,
    display: 'inline-flex',
    fontSize: { default: font.sm, [mq.sm]: font.base },
    gap: '0.25rem',
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    paddingBlock: 0,
    paddingInline: '0.25rem',
    textDecoration: 'none',
    transition: 'background-color 150ms',
    width: 'fit-content',
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
  },
  icon: {
    height: '1rem',
    width: '1rem',
  },
  jobs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  jobTitle: {
    fontSize: { default: font.sm, [mq.sm]: font.base },
    fontWeight: 500,
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
  },
  jobBody: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    marginTop: '0.5rem',
  },
  bullets: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    listStyleType: 'disc',
    marginTop: '0.5rem',
    paddingLeft: '1.25rem',
  },
  bullet: {
    marginBottom: '0.5rem',
  },
  earlyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
})

function ContactRow({ label, href, children }: { label: string; href: string; children: string }) {
  return (
    <div {...stylex.props(styles.row)}>
      <span {...stylex.props(styles.muted)}>{label}</span>
      <Link href={href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link)}>
        {children}
        <ArrowUpRight {...stylex.props(styles.icon)} />
      </Link>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.profile)}>
        <Avatar className={stylex.props(styles.avatar).className}>
          <AvatarFallback>RI</AvatarFallback>
        </Avatar>
        <div>
          <h1 {...stylex.props(styles.name)}>Reza Ilmi</h1>
          <p {...stylex.props(styles.muted)}>Design Engineer at GovTech</p>
        </div>
      </div>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>About</h2>
        <p {...stylex.props(styles.aboutText)}>
          Product designer with 10+ years experience in building 0-1 products and scalable design
          systems. Combines engineering background with design expertise to rapidly prototype and
          deliver polished, accessible products backed by user research. Leverages AI-powered design
          tools like v0, Cursor, and Figma to streamline design workflows and accelerate
          development. Excels in high-performing teams driven to create industry-leading products.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Contact</h2>
        <div {...stylex.props(styles.contactList)}>
          <ContactRow label="Portfolio" href="https://rezailmi.com">
            rezailmi.com
          </ContactRow>
          <ContactRow label="Email" href="mailto:hi.rezailmi@gmail.com">
            hi.rezailmi@gmail.com
          </ContactRow>
          <ContactRow label="LinkedIn" href="https://www.linkedin.com/in/rezailmi">
            rezailmi
          </ContactRow>
          <ContactRow label="X/Twitter" href="https://x.com/rezailmi">
            rezailmi
          </ContactRow>
        </div>
      </section>

      <section>
        <h2 {...stylex.props(styles.heading)}>Work Experience</h2>
        <div {...stylex.props(styles.jobs)}>
          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>Present</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>Design Engineer at GovTech</h3>
              <p {...stylex.props(styles.jobBody)}>
                Currently at GovTech Singapore, working on design engineering for government digital
                services.
              </p>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>Sep 2022 — 2025</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>Principal Product Designer at Terrascope</h3>
              <ul {...stylex.props(styles.bullets)}>
                <li {...stylex.props(styles.bullet)}>
                  Spearheaded the conceptualization of product design, design systems, and
                  prototyping initiatives.
                </li>
                <li {...stylex.props(styles.bullet)}>
                  Collaborated with cross-functional teams to align design vision with strategic
                  business goals.
                </li>
                <li>
                  Established processes that enhanced efficiency and consistency across product
                  experiences.
                </li>
              </ul>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>2021 — 2022</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>
                Senior Product Designer, Design Systems at MoneyHero Group (NMQ: MNY)
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Led the design systems team for 6 markets at a leading fintech company in Southeast
                Asia with over 10 million monthly users. Focused on unifying the experience and
                improving development efficiency for both designers and tech teams.
              </p>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>2019 — 2021</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>Senior Product Designer at SOL X</h3>
              <p {...stylex.props(styles.jobBody)}>
                Led Watch & Wearable product design at an IoT Marine-Tech Startup incubated at BCG
                Digital Ventures. Worked with Head of Product & Product Managers to define product
                vision and concept. Increased development efficiency by developing design systems
                for entire product line.
              </p>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>2016 — 2019</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>
                Senior User Interface Designer at Traveloka
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Built digital solutions and managed business unit&apos;s design system at a leading
                Southeast Asia online travel company. Redesigned payment experience across multiple
                platforms and markets. Improved Traveloka PayLater, increasing activation by 342% in
                3.5 months.
              </p>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>2014 — 2016</span>
            <div>
              <h3 {...stylex.props(styles.jobTitle)}>
                Co-founder, Product Designer at CharityLights
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Part-time role as co-founder and product designer.
              </p>
            </div>
          </div>

          <div {...stylex.props(styles.jobRow)}>
            <span {...stylex.props(styles.muted)}>Earlier Roles</span>
            <div>
              <ul {...stylex.props(styles.earlyList)}>
                <li>
                  <h3 {...stylex.props(styles.jobTitle)}>UI Designer at Mivo</h3>
                  <p {...stylex.props(styles.muted)}>2015 — 2016</p>
                </li>
                <li>
                  <h3 {...stylex.props(styles.jobTitle)}>UI/UX Design Intern at Microsoft</h3>
                  <p {...stylex.props(styles.muted)}>2014</p>
                </li>
                <li>
                  <h3 {...stylex.props(styles.jobTitle)}>Web Designer at NoLimit Analytics</h3>
                  <p {...stylex.props(styles.muted)}>2012 — 2013</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
