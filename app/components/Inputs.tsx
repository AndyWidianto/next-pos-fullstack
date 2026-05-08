import React, { ChangeEvent } from "react";

interface InputProps {
  label: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  props?: any;
}
export const InputText = ({ label, onChange, defaultValue, ...props }: InputProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      onChange={onChange}
      defaultValue={defaultValue}
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
    />
  </div>
);


export const TextArea = ({ label, onChange, defaultValue, ...props }: InputProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      rows={3}
      onChange={onChange}
      defaultValue={defaultValue}
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
    />
  </div>
);

interface Icon {
  value: string;
  label: string;
}

export const SelectIcon = ({ label, onChange, defaultValue, icons, ...props }: InputProps & { icons: Icon[] }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      onChange={onChange}
      defaultValue={defaultValue}
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
    >
      <option value="">Pilih Icon...</option>
      {icons.map((icon) => (
        <option key={icon.value} value={icon.value}>
          {icon.label}
        </option>
      ))}
    </select>
  </div>
);

export const Select = ({ label, onChange, defaultValue, children, ...props }: InputProps & { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      onChange={onChange}
      defaultValue={defaultValue}
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
    >
      <option value="">Pilih...</option>
      {children}
    </select>
  </div>
)