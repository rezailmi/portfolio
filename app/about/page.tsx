import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import * as stylex from '@stylexjs/stylex'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Box } from '@/components/box'
import { font, leading, mq, space, weight } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  page: {
    marginInline: 'auto',
    maxWidth: '42rem',
    paddingBlock: { default: space['4xl'], [mq.sm]: space['6xl'], [mq.md]: space['7xl'] },
    paddingInline: { default: space.lg, [mq.sm]: space['2xl'] },
  },
  profile: {
    marginBottom: { default: space['6xl'], [mq.sm]: space['7xl'] },
  },
  avatar: {
    height: { default: '4rem', [mq.sm]: '5rem' },
    marginBottom: space.lg,
    width: { default: '4rem', [mq.sm]: '5rem' },
  },
  name: {
    fontSize: { default: font.base, [mq.sm]: font.lg },
    fontWeight: weight.medium,
    lineHeight: { default: leading.base, [mq.sm]: leading.lg },
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
  },
  section: {
    marginBottom: { default: space['6xl'], [mq.sm]: space['7xl'] },
  },
  heading: {
    fontSize: font.base,
    fontWeight: weight.medium,
    lineHeight: leading.base,
    marginBottom: space.md,
  },
  aboutText: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: leading.relaxed,
    marginBottom: space.lg,
  },
  row: {
    alignItems: 'start',
    gap: { default: space.sm, [mq.sm]: space['3xl'] },
    gridTemplateColumns: { default: '100px 1fr', [mq.sm]: '140px 1fr' },
  },
  jobRow: {
    alignItems: 'start',
    gap: { default: space.md, [mq.sm]: space['4xl'] },
    gridTemplateColumns: { default: '1fr', [mq.sm]: '140px 1fr' },
  },
  link: {
    alignItems: 'center',
    borderRadius: radius.md,
    color: colors.foreground,
    display: 'inline-flex',
    fontSize: { default: font.sm, [mq.sm]: font.base },
    gap: space.xs,
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    paddingBlock: 0,
    paddingInline: space.xs,
    textDecoration: 'none',
    transition: 'background-color 150ms',
    width: 'fit-content',
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
  },
  icon: {
    height: '1rem',
    width: '1rem',
  },
  jobTitle: {
    fontSize: { default: font.sm, [mq.sm]: font.base },
    fontWeight: weight.medium,
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
  },
  jobBody: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    marginTop: space.sm,
  },
  bullets: {
    color: colors.mutedForeground,
    fontSize: { default: font.sm, [mq.sm]: font.base },
    lineHeight: { default: leading.sm, [mq.sm]: leading.base },
    listStyleType: 'disc',
    marginTop: space.sm,
    paddingLeft: space.xl,
  },
  bullet: {
    marginBottom: space.sm,
  },
  earlyList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
})

function ContactRow({ label, href, children }: { label: string; href: string; children: string }) {
  return (
    <Box display="grid" style={styles.row}>
      <Box as="span" display="inline" style={styles.muted}>
        {label}
      </Box>
      <Link href={href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link)}>
        {children}
        <ArrowUpRight {...stylex.props(styles.icon)} />
      </Link>
    </Box>
  )
}

export default function AboutPage() {
  return (
    <Box display="block" flex="1" style={styles.page}>
      <Box display="block" style={styles.profile}>
        <Avatar className={stylex.props(styles.avatar).className}>
          <AvatarFallback>RI</AvatarFallback>
        </Avatar>
        <Box display="block">
          <h1 {...stylex.props(styles.name)}>Reza Ilmi</h1>
          <p {...stylex.props(styles.muted)}>Design Engineer at GovTech</p>
        </Box>
      </Box>

      <Box as="section" display="block" style={styles.section}>
        <h2 {...stylex.props(styles.heading)}>About</h2>
        <p {...stylex.props(styles.aboutText)}>
          Product designer with 10+ years experience in building 0-1 products and scalable design
          systems. Combines engineering background with design expertise to rapidly prototype and
          deliver polished, accessible products backed by user research. Leverages AI-powered design
          tools like v0, Cursor, and Figma to streamline design workflows and accelerate
          development. Excels in high-performing teams driven to create industry-leading products.
        </p>
      </Box>

      <Box as="section" display="block" style={styles.section}>
        <h2 {...stylex.props(styles.heading)}>Contact</h2>
        <Box display="flex" flexDirection="column" gap="md">
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
        </Box>
      </Box>

      <Box as="section" display="block">
        <h2 {...stylex.props(styles.heading)}>Work Experience</h2>
        <Box display="flex" flexDirection="column" gap="4xl">
          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              Present
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>Design Engineer at GovTech</h3>
              <p {...stylex.props(styles.jobBody)}>
                Currently at GovTech Singapore, working on design engineering for government digital
                services.
              </p>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              Sep 2022 — 2025
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>Principal Product Designer at Terrascope</h3>
              <Box as="ul" display="block" style={styles.bullets}>
                <Box as="li" display="block" style={styles.bullet}>
                  Spearheaded the conceptualization of product design, design systems, and
                  prototyping initiatives.
                </Box>
                <Box as="li" display="block" style={styles.bullet}>
                  Collaborated with cross-functional teams to align design vision with strategic
                  business goals.
                </Box>
                <Box as="li" display="block">
                  Established processes that enhanced efficiency and consistency across product
                  experiences.
                </Box>
              </Box>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              2021 — 2022
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>
                Senior Product Designer, Design Systems at MoneyHero Group (NMQ: MNY)
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Led the design systems team for 6 markets at a leading fintech company in Southeast
                Asia with over 10 million monthly users. Focused on unifying the experience and
                improving development efficiency for both designers and tech teams.
              </p>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              2019 — 2021
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>Senior Product Designer at SOL X</h3>
              <p {...stylex.props(styles.jobBody)}>
                Led Watch & Wearable product design at an IoT Marine-Tech Startup incubated at BCG
                Digital Ventures. Worked with Head of Product & Product Managers to define product
                vision and concept. Increased development efficiency by developing design systems
                for entire product line.
              </p>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              2016 — 2019
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>
                Senior User Interface Designer at Traveloka
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Built digital solutions and managed business unit&apos;s design system at a leading
                Southeast Asia online travel company. Redesigned payment experience across multiple
                platforms and markets. Improved Traveloka PayLater, increasing activation by 342% in
                3.5 months.
              </p>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              2014 — 2016
            </Box>
            <Box display="block">
              <h3 {...stylex.props(styles.jobTitle)}>
                Co-founder, Product Designer at CharityLights
              </h3>
              <p {...stylex.props(styles.jobBody)}>
                Part-time role as co-founder and product designer.
              </p>
            </Box>
          </Box>

          <Box display="grid" style={styles.jobRow}>
            <Box as="span" display="inline" style={styles.muted}>
              Earlier Roles
            </Box>
            <Box display="block">
              <Box as="ul" display="flex" flexDirection="column" gap="sm" style={styles.earlyList}>
                <Box as="li" display="block">
                  <h3 {...stylex.props(styles.jobTitle)}>UI Designer at Mivo</h3>
                  <p {...stylex.props(styles.muted)}>2015 — 2016</p>
                </Box>
                <Box as="li" display="block">
                  <h3 {...stylex.props(styles.jobTitle)}>UI/UX Design Intern at Microsoft</h3>
                  <p {...stylex.props(styles.muted)}>2014</p>
                </Box>
                <Box as="li" display="block">
                  <h3 {...stylex.props(styles.jobTitle)}>Web Designer at NoLimit Analytics</h3>
                  <p {...stylex.props(styles.muted)}>2012 — 2013</p>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
