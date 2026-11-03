"use client";

import { PatientInfo } from "@/lib/types";

interface PatientFormProps {
  patient: PatientInfo;
  onChange: (patient: PatientInfo) => void;
}

export default function PatientForm({ patient, onChange }: PatientFormProps) {
  function set<K extends keyof PatientInfo>(key: K, value: PatientInfo[K]) {
    onChange({ ...patient, [key]: value });
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-4">
        Patient details
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 block">
          <span className="text-sm font-medium text-stone-600">Full name</span>
          <input
            type="text"
            value={patient.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Jane Doe"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-600">Age</span>
          <input
            type="number"
            min={0}
            value={patient.age}
            onChange={(e) => set("age", e.target.value)}
            placeholder="34"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-600">Gender</span>
          <select
            value={patient.gender}
            onChange={(e) => set("gender", e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="col-span-2 block">
          <span className="text-sm font-medium text-stone-600">Phone</span>
          <input
            type="tel"
            value={patient.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </label>
        <label className="col-span-2 block">
          <span className="text-sm font-medium text-stone-600">
            General notes
          </span>
          <textarea
            value={patient.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={2}
            placeholder="Allergies, medical history..."
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </label>
      </div>
    </div>
  );
}
