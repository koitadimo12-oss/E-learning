import type React from "react";

interface ChampSaisieProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChampSaisie({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
}: ChampSaisieProps) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="
          w-full
          px-4 py-2
          text-sm
          border border-gray-300
          rounded-lg
          shadow-sm
          transition
          focus:outline-none
          focus:ring-2 focus:ring-orange-500
          focus:border-orange-500
        "
      />
    </div>
  );
}

