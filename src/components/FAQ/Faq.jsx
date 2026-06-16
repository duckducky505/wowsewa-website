import { useState } from 'react';
import './Faq.css';

const Plus = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const Minus = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

const FAQS = [
  {
    q: 'How fast can a pro reach me?',
    a: 'Across the seven cities we cover, the average response time is about 38 minutes. Pick an emergency slot and the nearest available pro is dispatched right away; for everything else, choose a same-day or scheduled time that suits you.',
  },
  {
    q: 'How does pricing work?',
    a: 'Every service shows a flat starting price up front, before a pro is dispatched. The visit fee is adjusted into your final bill, and you only pay once the job is done — in the app or by cash. No call-out surprises.',
  },
  {
    q: 'Are your professionals verified?',
    a: 'Yes. Every WowSewa pro is ID-verified, background-checked, trained and rated after each visit. Many are graduates of our own WowSewa Academy certification courses.',
  },
  {
    q: 'Is there a warranty on repairs?',
    a: 'Every repair is covered by a 90-day warranty. If something isn\u2019t right, we send the same pro back to fix it free of charge — just re-book from your job history.',
  },
  {
    q: 'What\u2019s included in the Home Plus plan?',
    a: 'Home Plus is our annual membership: priority booking, two free maintenance visits, discounted call-out fees across every trade and an extended warranty on each job. Cancel any time.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'We currently operate across seven cities in Nepal — Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar, Butwal and Birgunj — with new locations added regularly. Enter your area in the app to confirm coverage.',
  },
];

const pad = (i) => String(i + 1).padStart(2, '0');

function Faq() {
  const [openIndex, setOpenIndex] = useState(2);
  const toggle = (i) => setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <section className="faq bg-main" id="faq">
      <div className="container">
        <div className="faq-head">
          <div>
            <div className="faq-eyebrow"><span className="ln" /> 06 — FAQ</div>
            <h2 className="faq-title">
              Questions,<br />
              <span className="accent-text-main">answered.</span>
            </h2>
          </div>
          <p className="faq-lead">
            Everything you need to know before you book. Still stuck? Call us on
            1800-WOW-SEWA — real humans, seven days a week.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div className={'faq-item' + (open ? ' is-open' : '')} key={i}>
                <button
                  className="faq-q"
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                >
                  <span className="faq-no">{pad(i)}</span>
                  <span className="faq-qt">{faq.q}</span>
                  <span className="faq-ico">{open ? <Minus /> : <Plus />}</span>
                </button>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;