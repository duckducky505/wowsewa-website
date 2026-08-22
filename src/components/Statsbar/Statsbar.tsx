import { Reveal,  CountUp } from "../../lib/lib";
import { StarRow, IconChat } from "../../assets/icons/Icons";
import { TESTIMONIALS, STATS } from "../../data/data";


export default function StatsBar (){

  return(
      <>
        {/* stats band */}
        <div className="relative mt-20 border-y-4 border-ink bg-lime text-ink">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x-2 divide-ink/15 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} className={i >= 2 ? "border-t-2 border-ink/15 lg:border-t-0" : ""}>
                <div className="group px-6 py-10 text-center transition-colors duration-300 hover:bg-ink/[0.06] sm:px-8">
                  <p className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 font-mono text-[11px] font-bold tracking-[0.22em] text-ink/65">{s.label.toUpperCase()}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </>
    );
};


