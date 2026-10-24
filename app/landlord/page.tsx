import Link from "next/link"
import { ArrowLeft, Bell, Building2, CalendarCheck2, CreditCard, House, TrendingUp, Users } from "lucide-react"

const overviewStats = [
  { label: "Monthly income", value: "KES 576,000", trend: "+12.4%" },
  { label: "Occupancy", value: "94%", trend: "+3.1%" },
  { label: "Open maintenance", value: "7", trend: "-2" },
  { label: "Outstanding rent", value: "KES 84,500", trend: "-8.2%" },
]

const unitRows = [
  { name: "A1", tenant: "Mary Wanjiku", rent: "KES 25,000", status: "Paid", color: "bg-emerald-100 text-emerald-700" },
  { name: "A2", tenant: "David Otieno", rent: "KES 26,000", status: "Pending", color: "bg-amber-100 text-amber-700" },
  { name: "B1", tenant: "Vacant", rent: "KES 32,000", status: "Available", color: "bg-sky-100 text-sky-700" },
  { name: "C3", tenant: "Grace Njeri", rent: "KES 18,000", status: "Paid", color: "bg-emerald-100 text-emerald-700" },
]

const reminders = [
  "Lease renewal review for Unit A2 due in 12 days",
  "Boiler inspection scheduled for Unit B4 this Friday",
  "Water bill payment reminder for April has been sent",
]

export default function LandlordPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-slate-600 transition hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to website</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">HomeMate</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Landlord dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-slate-900 p-6 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Portfolio overview</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your rental business at a glance</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              <Bell className="h-4 w-4" />
              Alerts
            </button>
            <Link href="/admin" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Open admin panel
            </Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-sm font-medium">{stat.label}</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Rental performance</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Unit occupancy</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">This month</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <House className="h-5 w-5 text-slate-900" />
                  <span className="text-sm font-medium">Total units</span>
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">80</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Users className="h-5 w-5 text-slate-900" />
                  <span className="text-sm font-medium">Occupied</span>
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">75</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <CalendarCheck2 className="h-5 w-5 text-slate-900" />
                  <span className="text-sm font-medium">Vacant</span>
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">5</p>
              </div>
            </div>

            <div className="mt-6 h-52 rounded-[20px] bg-gradient-to-r from-slate-100 via-sky-50 to-emerald-50 p-4">
              <div className="flex h-full items-end gap-3">
                {[30, 46, 58, 70, 84, 94].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-2xl bg-slate-900/90" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Cash flow</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Collections</h2>
              </div>
              <CreditCard className="h-5 w-5 text-slate-500" />
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Collected this month</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">KES 408,750</p>
            </div>

            <div className="mt-5 space-y-3">
              {reminders.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Portfolio status</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Units overview</h2>
            </div>
            <Link href="/admin" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
              Manage properties
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Unit</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tenant</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rent</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {unitRows.map((unit) => (
                  <tr key={unit.name} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-900">{unit.name}</td>
                    <td className="px-4 py-4 text-slate-600">{unit.tenant}</td>
                    <td className="px-4 py-4 text-slate-700">{unit.rent}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${unit.color}`}>
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
