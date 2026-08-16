import React from "react";
import { PublicPageShell } from "../components/PublicPageShell";

export function PrivacyPolicyPage() {
  return (
    <PublicPageShell
      eyebrow="Privacy Policy"
      title="Your privacy, explained clearly."
      intro="This policy describes the information Lume processes, why it is used, and the choices available to you."
    >
      <p className="public-info-page__updated">Last updated: August 16, 2026</p>

      <section>
        <h2>1. Information we process</h2>
        <p>
          When you create or use an account, Lume may process your name,
          username, email address, profile image, authentication information,
          videos, thumbnails, comments, community posts, subscriptions, likes,
          saved videos, watch history, and notification activity.
        </p>
        <p>
          We may also process basic technical information needed to operate and
          protect the service, such as browser type, device type, timestamps,
          request logs, and approximate network information.
        </p>
      </section>

      <section>
        <h2>2. How information is used</h2>
        <ul>
          <li>Provide accounts, profiles, video playback, uploads, and community features.</li>
          <li>Personalize subscriptions, saved content, history, search, and notifications.</li>
          <li>Keep sessions secure and detect misuse, fraud, or technical problems.</li>
          <li>Understand product performance and improve accessibility and reliability.</li>
        </ul>
      </section>

      <section>
        <h2>3. Cookies and sessions</h2>
        <p>
          Lume uses authentication tokens and similar browser storage to keep
          you signed in, protect requests, remember preferences, and restore a
          valid session. Sessions end when you sign out, revoke access, or the
          applicable token expires.
        </p>
      </section>

      <section>
        <h2>4. Sharing and service providers</h2>
        <p>
          Public profile details and content you publish can be viewed by other
          people. Lume may rely on infrastructure providers for database,
          storage, hosting, and security operations. Information is shared only
          as needed to provide those functions, comply with law, or protect the
          service and its users. Lume does not sell personal information.
        </p>
      </section>

      <section>
        <h2>5. Retention and security</h2>
        <p>
          Information is retained while it is needed to operate your account,
          meet legal obligations, resolve disputes, and protect the platform.
          Reasonable technical and organizational safeguards are used, but no
          online service can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>6. Your choices</h2>
        <p>
          You can update account details, control public content, manage saved
          items and subscriptions, sign out of your session, or request account
          support. Depending on where you live, local law may provide additional
          rights to access, correct, export, restrict, or delete information.
        </p>
      </section>

      <section>
        <h2>7. Children and policy changes</h2>
        <p>
          Lume is not intended for children who are below the minimum age
          required to use online services in their region. Material policy
          changes will be reflected on this page with a revised update date.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          For privacy questions or requests, contact the Lume project owner
          through the official project repository or the support channel made
          available in the application.
        </p>
      </section>
    </PublicPageShell>
  );
}

