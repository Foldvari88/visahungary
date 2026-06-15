import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";

const locales = new Set(["en", "zh"]);

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.has(locale)) {
    notFound();
  }

  return <TermsContent locale={locale as Locale} />;
}

function TermsContent({ locale }: { locale: Locale }) {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href={`/${locale}/calculator`}>
          Back to calculator
        </Link>
        <p className="legal-kicker">VisaHungary legal</p>
        <h1>Terms and Conditions</h1>
        <p className="legal-updated">Last updated: 1 June 2026</p>

        <section>
          <h2>1. Service provider</h2>
          <p>
            These Terms and Conditions apply to the online visa and residence
            route pre-screening calculator operated under the VisaHungary brand.
            Before launch, replace the placeholders below with the final
            business details:
          </p>
          <ul>
            <li>Legal name: [Company legal name]</li>
            <li>Registered address: [Registered address]</li>
            <li>Company registration number: [Company registration number]</li>
            <li>Tax number: [Tax number]</li>
            <li>Email: [contact@visahungary.hu]</li>
          </ul>
        </section>

        <section>
          <h2>2. What the calculator does</h2>
          <p>
            The calculator provides preliminary information about possible
            Hungarian visa, residence permit, and related immigration routes
            based on the answers submitted by the user. The result may include a
            likely route, possible alternatives, a general process path, and a
            document checklist.
          </p>
          <p>
            The calculator is a pre-screening and lead qualification tool. It is
            designed to help users understand which route may be relevant before
            requesting professional support.
          </p>
        </section>

        <section>
          <h2>3. No legal advice and no guarantee</h2>
          <p>
            The calculator does not provide legal advice, official authority
            advice, or a final eligibility decision. It must not be treated as a
            guarantee that any visa, residence permit, or status will be granted.
          </p>
          <p>
            Final eligibility depends on current Hungarian, Schengen, EU, and
            authority rules, the user&apos;s exact facts, supporting documents,
            deadlines, official fees, appointment availability, and the decision
            of the competent authority.
          </p>
        </section>

        <section>
          <h2>4. User responsibilities</h2>
          <p>By using the calculator, the user agrees to:</p>
          <ul>
            <li>provide accurate and complete information;</li>
            <li>not submit false, misleading, or third-party data unlawfully;</li>
            <li>verify all official requirements before taking action;</li>
            <li>
              seek individual professional advice where the case involves
              refusal, overstay, criminal history, entry ban, urgent deadlines,
              or complex family, employment, business, or investment facts.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Email-gated result</h2>
          <p>
            The calculator may show a teaser result before email submission. The
            detailed result is sent by email after the user provides an email
            address and accepts the Privacy Notice.
          </p>
          <p>
            The service provider may also receive the submitted answers and
            computed route summary as a lead record for follow-up, subject to
            the Privacy Notice.
          </p>
        </section>

        <section>
          <h2>6. Consultation and paid services</h2>
          <p>
            Any paid consultation, case handling, document review, application
            support, translation coordination, or representation service must be
            governed by a separate written agreement, engagement letter, or
            service confirmation.
          </p>
          <p>
            Government fees, consular fees, VFS or appointment centre fees,
            translation, apostille, courier, insurance, and third-party costs
            are not included unless expressly stated in a separate offer.
          </p>
        </section>

        <section>
          <h2>7. Availability and changes</h2>
          <p>
            The calculator is provided on an &quot;as available&quot; basis. The
            service provider may update, suspend, or discontinue the calculator,
            questions, route logic, content, or email delivery flow at any time.
          </p>
        </section>

        <section>
          <h2>8. Intellectual property</h2>
          <p>
            The calculator design, question flow, text, logic, route summaries,
            and related materials are protected content unless otherwise stated.
            Users may use their own assessment result for personal decision
            making, but may not copy, resell, scrape, or reproduce the service.
          </p>
        </section>

        <section>
          <h2>9. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, the service
            provider is not liable for decisions taken solely on the basis of
            calculator output, unsuccessful applications, missed deadlines,
            authority delays, appointment unavailability, changes in law or
            official practice, or inaccurate information submitted by the user.
          </p>
        </section>

        <section>
          <h2>10. Governing law and disputes</h2>
          <p>
            These Terms are intended to be governed by Hungarian law, unless
            mandatory consumer protection rules provide otherwise. Any dispute
            should first be addressed by contacting the service provider at the
            email address listed above.
          </p>
        </section>

        <section>
          <h2>11. Privacy</h2>
          <p>
            Personal data is processed as described in the{" "}
            <Link href={`/${locale}/privacy`}>Privacy Notice</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
