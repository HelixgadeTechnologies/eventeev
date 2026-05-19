import { HiOutlineCheckCircle, HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: null,
    description: "Perfect for individuals running small events and getting started.",
    highlight: false,
    cta: "Get Started",
    href: "/sign-up",
    features: [
      "Up to 2 events per month",
      "100 attendees per event",
      "Basic ticketing",
      "Event dashboard",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "₦15,000",
    period: "/ month",
    description: "For teams and organizers who need advanced tools and more capacity.",
    highlight: true,
    cta: "Start Free Trial",
    href: "/sign-up",
    features: [
      "Unlimited events",
      "Up to 1,000 attendees per event",
      "Custom ticketing tiers",
      "Live polls & Q&A",
      "Networking & matchmaking",
      "Analytics & reporting",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: null,
    description: "For large organizations with high-volume events and dedicated needs.",
    highlight: false,
    cta: "Contact Sales",
    href: "mailto:sales@eventeev.com",
    features: [
      "Unlimited attendees",
      "Dedicated account manager",
      "White-label options",
      "Custom integrations",
      "SLA & uptime guarantee",
      "On-site support available",
      "Custom contracts & invoicing",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#eb5017]/10 px-3 py-1.5 rounded-full">
          <HiOutlineSparkles className="text-[#eb5017] text-sm" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#eb5017]">Simple Pricing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1B1818] tracking-tight leading-tight">
          Plans for every<br />type of organizer
        </h1>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">
          Start for free, scale as you grow. No hidden fees — only pay for what your events need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl p-7 border transition-all duration-300 ${
              plan.highlight
                ? "bg-[#1B1818] border-[#1B1818] shadow-2xl shadow-black/20 md:-mt-4 md:mb-4"
                : "bg-white border-gray-100 shadow-sm hover:shadow-lg"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#eb5017] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-[#eb5017]/30">
                  Most Popular
                </span>
              </div>
            )}

            <div className="space-y-1 mb-6">
              <p className={`text-[10px] font-black uppercase tracking-widest ${plan.highlight ? "text-[#eb5017]" : "text-gray-400"}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1">
                <span className={`text-4xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-[#1B1818]"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm font-medium mb-1 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium leading-relaxed ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                {plan.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <HiOutlineCheckCircle className={`text-lg shrink-0 ${plan.highlight ? "text-[#eb5017]" : "text-[#eb5017]"}`} />
                  <span className={`text-xs font-medium ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block w-full text-center py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                plan.highlight
                  ? "bg-[#eb5017] text-white hover:bg-[#d64815] shadow-lg shadow-[#eb5017]/30"
                  : "bg-[#1B1818] text-white hover:bg-black"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF4ED] rounded-2xl p-6 border border-orange-100 text-center space-y-2">
        <p className="text-sm font-black text-[#1B1818]">Need something different?</p>
        <p className="text-xs text-[#C27E33] font-medium leading-relaxed max-w-lg mx-auto">
          All plans include a 14-day free trial. No credit card required. Upgrade, downgrade, or cancel at any time.
        </p>
      </div>
    </div>
  );
}
