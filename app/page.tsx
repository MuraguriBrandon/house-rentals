import Link from "next/link"

const featuredHomes = [
  {
    id: 101,
    title: "Skyline Residency",
    location: "Westlands, Nairobi",
    price: "KES 45,000",
    beds: 2,
    baths: 2,
    size: "980 sq ft",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 102,
    title: "Garden Court",
    location: "Kilimani, Nairobi",
    price: "KES 38,000",
    beds: 1,
    baths: 1,
    size: "720 sq ft",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 103,
    title: "Riverview Homes",
    location: "Mlolongo, Machakos",
    price: "KES 29,000",
    beds: 2,
    baths: 1,
    size: "860 sq ft",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
]

const stats = [
  { label: "Homes Listed", value: "1,200+" },
  { label: "Happy Tenants", value: "2,800+" },
  { label: "Avg. Response", value: "< 24 hrs" },
  { label: "Cities Covered", value: "18" },
]

const amenities = [
  "Secure parking",
  "24/7 security",
  "High-speed Wi-Fi",
  "Children play area",
  "Water backup",
  "On-site management",
]

const steps = [
  { title: "Browse Homes", text: "Explore verified apartments and houses tailored to your budget and lifestyle." },
  { title: "Book a Visit", text: "Choose a date and arrange a quick viewing with our property team." },
  { title: "Move In", text: "Finalize your lease and get into your new home with clear, simple steps." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              H
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">HomeMate</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Rentals</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#featured" className="transition hover:text-slate-900">Featured</Link>
            <Link href="#benefits" className="transition hover:text-slate-900">Benefits</Link>
            <Link href="#process" className="transition hover:text-slate-900">How it works</Link>
            <Link href="#contact" className="transition hover:text-slate-900">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/landlord"
              className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 sm:inline-flex"
            >
              Landlord page
            </Link>
            <Link
              href="/portal"
              className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 sm:inline-flex"
            >
              Tenant portal
            </Link>
            <Link
              href="#featured"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              View listings
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.25),transparent_45%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_42%,#f8fafc_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
              Trusted by modern renters
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find a place that feels like home.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Discover comfortable apartments and homes in Nairobi’s most desirable neighborhoods with transparent pricing, responsive service, and a smooth move-in journey.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#featured"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-700"
              >
                Explore homes
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900"
              >
                Talk to an agent
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-amber-200 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-violet-200 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_40px_120px_rgba(15,23,42,0.12)]">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                alt="Modern apartment exterior"
                className="h-[520px] w-full rounded-[22px] object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Featured home</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">Palmview Apartments</h2>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    Available now
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>2 bed • 2 bath</span>
                  <span className="text-lg font-bold text-slate-900">KES 52,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Featured homes</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Homes people love to stay in</h2>
          </div>
          <Link href="/contact" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
            Get a custom shortlist
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {featuredHomes.map((home) => (
            <article key={home.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={home.image} alt={home.title} className="h-64 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{home.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{home.location}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700">
                    Available
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-5 text-sm text-slate-600">
                    <span>{home.beds} bed</span>
                    <span>{home.baths} bath</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{home.price}</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
                  <span>{home.size}</span>
                  <Link href={`/book/${home.id}`} className="font-semibold text-slate-900 hover:text-slate-600">
                    Book a visit →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="benefits" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Why renters choose us</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Simple, transparent, and stress-free living</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {amenities.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-lg text-emerald-300">✓</div>
                <p className="text-lg font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Your move-in plan in three steps</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Let’s find your next home</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Need a place that fits your lifestyle?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Tell us what you need and our team will curate a shortlist of rental homes that match your budget, neighborhood, and move-in timeline.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Contact us
            </Link>
            <a
              href="tel:+254712345678"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/5"
            >
              Call +254 712 345 678
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 HomeMate Rentals. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#featured" className="hover:text-slate-900">Listings</Link>
            <Link href="/portal" className="hover:text-slate-900">Portal</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
