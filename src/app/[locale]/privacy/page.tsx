import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";

const locales = new Set(["en", "zh"]);

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.has(locale)) {
    notFound();
  }

  return <PrivacyContent locale={locale as Locale} />;
}

function PrivacyContent({ locale }: { locale: Locale }) {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href={`/${locale}/calculator`}>
          Back to calculator
        </Link>
        <p className="legal-kicker">VisaHungary legal</p>
        <h1>Privacy Notice</h1>
        <p className="legal-updated">Last updated: 1 June 2026</p>

        <section>
          <h2>1. Controller</h2>
          <p>
            This Privacy Notice explains how personal data is processed when a
            user completes the VisaHungary online visa and residence route
            calculator.
          </p>
          <p>
            Before launch, replace the placeholders below with the final
            controller details:
          </p>
          <ul>
            <li>Controller: [Company legal name]</li>
            <li>Registered address: [Registered address]</li>
            <li>Email: [privacy@visahungary.hu]</li>
            <li>Data Protection Officer, if appointed: [DPO contact]</li>
          </ul>
        </section>

        <section>
          <h2>2. Data we process</h2>
          <p>Depending on the answers submitted, we may process:</p>
          <ul>
            <li>contact data, such as email address;</li>
            <li>citizenship and current location;</li>
            <li>intended stay length and travel or relocation purpose;</li>
            <li>
              immigration context, such as current Hungarian or EU residence
              permit status, visa-free entry status, prior refusal or overstay
              indicators, and deadline urgency;
            </li>
            <li>
              route-specific information about work, study, family sponsor,
              business, remote work, income band, investment capacity, housing,
              financial means, and insurance readiness;
            </li>
            <li>technical data, such as timestamp, source page, and server logs;</li>
            <li>
              consent records, including privacy acceptance and optional
              marketing consent.
            </li>
          </ul>
          <p>
            Users should not submit special category data, criminal record
            documents, passport scans, or other sensitive documents through the
            calculator unless a separate secure upload process is provided.
          </p>
        </section>

        <section>
          <h2>3. Purposes and legal bases</h2>
          <div className="legal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Legal basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Generate a preliminary visa/residence route assessment</td>
                  <td>Consent and steps requested by the user</td>
                </tr>
                <tr>
                  <td>Send the full result by email</td>
                  <td>Consent and performance of the requested service</td>
                </tr>
                <tr>
                  <td>Store the submitted answers as a lead record</td>
                  <td>Legitimate interest in responding to user enquiries</td>
                </tr>
                <tr>
                  <td>Follow up about the assessment or consultation request</td>
                  <td>Legitimate interest or consent, depending on context</td>
                </tr>
                <tr>
                  <td>Send marketing updates</td>
                  <td>Consent</td>
                </tr>
                <tr>
                  <td>Security, abuse prevention, and service diagnostics</td>
                  <td>Legitimate interest in operating a secure service</td>
                </tr>
                <tr>
                  <td>Compliance with legal obligations</td>
                  <td>Legal obligation, where applicable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>4. Automated assessment</h2>
          <p>
            The calculator uses deterministic rule-based scoring to generate a
            preliminary route suggestion. The result does not have legal or
            similarly significant effects. It does not decide whether a user can
            obtain a visa, residence permit, or status. High-risk or unclear
            cases are routed to manual review.
          </p>
        </section>

        <section>
          <h2>5. Recipients and processors</h2>
          <p>Personal data may be shared with service providers that help us:</p>
          <ul>
            <li>host and operate the website;</li>
            <li>send transactional emails;</li>
            <li>store CRM or lead records;</li>
            <li>monitor security, errors, and service performance;</li>
            <li>provide professional consultation or case support, if requested.</li>
          </ul>
          <p>
            Before launch, list the actual providers here, for example hosting
            provider, email provider, CRM provider, analytics provider, and
            professional service providers.
          </p>
        </section>

        <section>
          <h2>6. International transfers</h2>
          <p>
            If any processor stores or accesses personal data outside the
            European Economic Area, appropriate safeguards must be used, such as
            an adequacy decision, Standard Contractual Clauses, or another
            lawful transfer mechanism under the GDPR.
          </p>
        </section>

        <section>
          <h2>7. Retention</h2>
          <div className="legal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Default retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Incomplete anonymous calculator session</td>
                  <td>Up to 30 days</td>
                </tr>
                <tr>
                  <td>Assessment lead record and result email data</td>
                  <td>Up to 24 months after the last interaction</td>
                </tr>
                <tr>
                  <td>Consultation or paid service records</td>
                  <td>As required by contract, accounting, and legal rules</td>
                </tr>
                <tr>
                  <td>Marketing consent</td>
                  <td>Until withdrawal or inactivity-based deletion</td>
                </tr>
                <tr>
                  <td>Security and technical logs</td>
                  <td>Usually up to 90 days, unless needed for investigation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>8. Your rights</h2>
          <p>
            Subject to GDPR conditions, users may request access, rectification,
            erasure, restriction, portability, objection to processing, and
            withdrawal of consent. Users also have the right not to be subject to
            a solely automated decision that produces legal or similarly
            significant effects.
          </p>
          <p>
            To exercise rights, contact [privacy@visahungary.hu]. We may need
            to verify the identity of the requester before responding.
          </p>
        </section>

        <section>
          <h2>9. Complaints</h2>
          <p>
            Users may contact the Hungarian National Authority for Data
            Protection and Freedom of Information (NAIH) if they believe their
            data protection rights have been infringed.
          </p>
          <ul>
            <li>Website: https://www.naih.hu</li>
            <li>Email: ugyfelszolgalat@naih.hu</li>
          </ul>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>
            We use reasonable technical and organisational measures designed to
            protect personal data against unauthorised access, loss, misuse, or
            alteration. No online service can be guaranteed to be completely
            secure.
          </p>
        </section>

        <section>
          <h2>11. Changes</h2>
          <p>
            This Privacy Notice may be updated from time to time. The latest
            version will be published on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
