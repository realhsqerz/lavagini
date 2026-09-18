"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function AppointmentCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  const [selected, setSelected] = useState(value || todayIso);
  const [view, setView] = useState(() => {
    const [year, month] = (value || todayIso).split("-").map(Number);
    return { year: year || today.getFullYear(), month: Math.max(0, (month || today.getMonth() + 1) - 1) };
  });

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const list: { day: number | null; iso: string; disabled: boolean }[] = [];
    for (let i = 0; i < offset; i += 1) {
      list.push({ day: null, iso: "", disabled: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = toIso(view.year, view.month, day);
      list.push({ day, iso, disabled: iso < todayIso });
    }
    return list;
  }, [view, todayIso]);

  const canGoPrev =
    view.year > today.getFullYear() ||
    (view.year === today.getFullYear() && view.month > today.getMonth());

  function changeMonth(delta: number) {
    setView((current) => {
      const month = current.month + delta;
      if (month < 0) return { year: current.year - 1, month: 11 };
      if (month > 11) return { year: current.year + 1, month: 0 };
      return { ...current, month };
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold capitalize text-primary">
          {MONTHS[view.month]} {view.year}
        </p>
        <div className="flex gap-1">
          <IconButton onClick={() => changeMonth(-1)} disabled={!canGoPrev} label="Mois précédent">
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={() => changeMonth(1)} label="Mois suivant">
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-3 sm:p-4">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
          >
            {weekday}
          </div>
        ))}
        {cells.map((cell, index) =>
          cell.day === null ? (
            <div key={`empty-${index}`} />
          ) : (
            <button
              key={cell.iso}
              type="button"
              disabled={cell.disabled}
              onClick={() => {
                setSelected(cell.iso);
                onChange(cell.iso);
              }}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition sm:h-10 sm:w-10 ${
                cell.disabled
                  ? "text-slate-300"
                  : cell.iso === selected
                    ? "bg-accent font-semibold text-white shadow-sm"
                    : cell.iso === todayIso
                      ? "bg-blue-50 font-semibold text-accent"
                      : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cell.day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}