import * as stylex from '@stylexjs/stylex'
import { colors } from '@/lib/tokens.stylex'

const SM = '@media (min-width: 40rem)'
const MD = '@media (min-width: 48rem)'

const styles = stylex.create({
  page: {
    flex: 1,
    marginInline: 'auto',
    paddingBlock: '2rem',
    paddingInline: '1rem',
    [SM]: {
      paddingBlock: '3rem',
      paddingInline: '1.5rem',
    },
    [MD]: {
      paddingBlock: '4rem',
    },
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    marginInline: 'auto',
    maxWidth: '42rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    [SM]: {
      fontSize: '1.875rem',
    },
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
  },
  lead: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 600,
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
            This policy explains how apps created by the owner of this website treat personal data. We
            build privacy-first experiences: data stays private to you, is only used to support the
            features you select, and is never sold or shared for advertising.
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
