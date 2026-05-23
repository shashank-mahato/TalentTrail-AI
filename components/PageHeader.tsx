interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-trail-indigo">
          {eyebrow}
        </p>
      ) : null}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}
