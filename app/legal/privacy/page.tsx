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
      'We do not monitor, mine, or analyze personal content for advertising, profiling, or monetization purposes.'
    ]
  },
  {
    title: 'How We Use Information',
    paragraphs: [
      'Collected information is used solely to deliver, maintain, and improve the specific app features you choose to use.',
      'We may generate anonymized operational metrics (for example, aggregate usage counts) to keep services reliable. These metrics cannot be used to identify any individual user.'
    ]
  },
  {
    title: 'Data Sharing',
    paragraphs: [
      'We never sell or rent personal data. We do not share personal information with third parties unless you explicitly initiate the action (such as exporting your own data) or when required to comply with applicable laws.'
    ]
  },
  {
    title: 'Your Choices and Control',
    paragraphs: [
      'You can access, update, or delete data stored within each app at any time through the provided settings or support channels.',
      'If you request deletion of your account or data, we remove associated information from our systems within a reasonable timeframe, subject to legal obligations.'
    ]
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We implement technical and organizational safeguards to protect personal data against unauthorized access, alteration, disclosure, or destruction.',
      'Despite these efforts, no method of transmission or storage is completely secure, so we encourage you to use strong passwords and keep your devices updated.'
    ]
  },
  {
    title: 'Contact',
    paragraphs: [
      'If you have questions about this Privacy Policy or would like to exercise your privacy rights, contact us at hi.rezailmi@gmail.com.'
    ]
  }
]

function Section({ title, paragraphs }: SectionItem) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex-1 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Privacy Policy</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Your Privacy, Your Control</h1>
          <p className="text-sm text-muted-foreground">Effective {effectiveDate}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This policy explains how apps created by the owner of this website treat personal data. We
            build privacy-first experiences: data stays private to you, is only used to support the
            features you select, and is never sold or shared for advertising.
          </p>
        </header>
        <div className="space-y-8">
          {policySections.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </div>
      </div>
    </div>
  )
}

