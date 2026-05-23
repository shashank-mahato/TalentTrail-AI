import { CareerTwinCard } from "@/components/CareerTwinCard";
import { PageHeader } from "@/components/PageHeader";
import { careerTwinPaths } from "@/lib/mockData";

export default function CareerTwinPage() {
  return (
    <main>
      <PageHeader
        eyebrow="CareerTwin"
        title="Compare career paths before choosing one"
        description="CareerTwin shows which path is realistic now, what skills are missing, how long readiness may take, and the next step that reduces risk."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-950">Riti&apos;s path comparison</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Base MVP uses mock comparison data so the demo works without credentials. The architecture
            includes a CareerTwin agent prompt placeholder for future AI-powered comparisons.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {careerTwinPaths.map((path) => (
            <CareerTwinCard key={path.role} path={path} />
          ))}
        </div>
      </section>
    </main>
  );
}
