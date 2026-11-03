"use client";

import { useMemo, useState } from "react";
import ToothChart from "@/components/ToothChart";
import ToothForm from "@/components/ToothForm";
import PatientForm from "@/components/PatientForm";
import { TOOTH_META } from "@/lib/toothLayout";
import { PatientInfo, ToothRecord } from "@/lib/types";

const EMPTY_RECORD: ToothRecord = { procedure: "none", notes: "" };

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [records, setRecords] = useState<Record<number, ToothRecord>>({});
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: "",
    gender: "",
    phone: "",
    notes: "",
  });

  const treatedCount = useMemo(
    () => Object.values(records).filter((r) => r.procedure !== "none").length,
    [records]
  );

  function updateRecord(toothNumber: number, record: ToothRecord) {
    setRecords((prev) => ({ ...prev, [toothNumber]: record }));
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-stone-800">
              Dental Chart
            </h1>
            <p className="text-sm text-stone-500">
              Click a tooth to record a treatment
            </p>
          </div>
          <div className="text-sm text-stone-500">
            <span className="font-medium text-teal-600">{treatedCount}</span>{" "}
            / 32 teeth marked
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-6 gap-8">
        {/* Left: chart */}
        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6">
            <ToothChart
              records={records}
              selected={selected}
              onSelect={setSelected}
            />

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border border-stone-300 bg-[#FAF6EC]" />
                No treatment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border border-yellow-500 bg-yellow-300" />
                Root canal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border border-red-600 bg-red-500" />
                Remove
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border-2 border-yellow-500 bg-white" />
                Selected
              </span>
            </div>
          </div>
        </section>

        {/* Right: forms */}
        <section className="lg:col-span-4 space-y-6">
          <PatientForm patient={patient} onChange={setPatient} />

          {selected ? (
            <ToothForm
              toothNumber={selected}
              record={records[selected] ?? EMPTY_RECORD}
              onChange={(record) => updateRecord(selected, record)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-sm text-stone-500">
              Select a tooth on the chart to add a treatment.
            </div>
          )}

          {treatedCount > 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
                Treatment summary
              </h3>
              <ul className="space-y-1.5 text-sm">
                {TOOTH_META.filter(
                  (m) => records[m.number]?.procedure !== "none" && records[m.number]
                ).map((m) => (
                  <li
                    key={m.number}
                    className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-stone-50"
                  >
                    <button
                      className="text-stone-700 hover:text-teal-600"
                      onClick={() => setSelected(m.number)}
                    >
                      #{m.number} &middot; {m.label}
                    </button>
                    <span
                      className={
                        records[m.number].procedure === "root-canal"
                          ? "text-yellow-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {records[m.number].procedure === "root-canal"
                        ? "Root canal"
                        : "Remove"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
