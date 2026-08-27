import * as stylex from '@stylexjs/stylex'
import { font, leading, mq, space, weight, tracking } from '@/lib/constants.stylex'
import { colors } from '@/lib/tokens.stylex'

const styles = stylex.create({
  page: {
    flex: '1',
    marginInline: 'auto',
    paddingBlock: { default: space['4xl'], [mq.sm]: space['6xl'], [mq.md]: space['7xl'] },
    paddingInline: { default: space.lg, [mq.sm]: space['2xl'] },
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['5xl'],
    marginInline: 'auto',
    maxWidth: '42rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.md,
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: font.xs,
    letterSpacing: tracking.wide,
    lineHeight: leading.xs,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: { default: font.xl2, [mq.sm]: '1.875rem' },
    fontWeight: weight.semibold,
    lineHeight: { default: leading.xl2, [mq.sm]: '2.25rem' },
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  lead: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.relaxed,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['4xl'],
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.md,
  },
  heading: {
    fontSize: font.base,
    fontWeight: weight.semibold,
    lineHeight: leading.base,
  },
})

interface SectionItem {
  readonly title: string
  readonly paragraphs: readonly string[]
}

const effectiveDate = 'October 18, 2025'

const policySections: SectionItem[] = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'We design products that respect personal data by default. Our apps only collect the minimum information required to provide requested features, such as account credentials or content you deliberately store within the app.',
      'We do not monitor, mine, or analyze personal content for advertising, profiling, or monetization purposes.',
    ],
  },
  {
    title: 'How We Use Information',
    paragraphs: [
      'Collected information is used solely to deliver, maintain, and improve the specific app features you choose to use.',
      'We may generate anonymized operational metrics (for example, aggregate usage counts) to keep services reliable. These metrics cannot be used to identify any individual user.',
    ],
  },
  {
    title: 'Data Sharing',
    paragraphs: [
      'We never sell or rent personal data. We do not share personal information with third parties unless you explicitly initiate the action (such as exporting your own data) or when required to comply with applicable laws.',
    ],
  },
  {
    title: 'Your Choices and Control',
    paragraphs: [
      'You can access, update, or delete data stored within each app at any time through the provided settings or support channels.',
      'If you request deletion of your account or data, we remove associated information from our systems within a reasonable timeframe, subject to legal obligations.',
    ],
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We implement technical and organizational safeguards to protect personal data against unauthorized access, alteration, disclosure, or destruction.',
      'Despite these efforts, no method of transmission or storage is completely secure, so we encourage you to use strong passwords and keep your devices updated.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      'If you have questions about this Privacy Policy or would like to exercise your privacy rights, contact us at hi.rezailmi@gmail.com.',
    ],
  },
]

function Section({ title, paragraphs }: SectionItem) {
  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} {...stylex.props(styles.lead)}>
          {paragraph}
        </p>
      ))}
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <header {...stylex.props(styles.header)}>
          <p {...stylex.props(styles.eyebrow)}>Privacy Policy</p>
          <h1 {...stylex.props(styles.title)}>Your Privacy, Your Control</h1>
          <p {...stylex.props(styles.muted)}>Effective {effectiveDate}</p>
          <p {...stylex.props(styles.lead)}>
            This policy explains how apps created by the owner of this website treat personal data.
            We build privacy-first experiences: data stays private to you, is only used to support
            the features you select, and is never sold or shared for advertising.
          </p>
        </header>
        <div {...stylex.props(styles.sections)}>
          {policySections.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </div>
      </div>
    </div>
  )
}
