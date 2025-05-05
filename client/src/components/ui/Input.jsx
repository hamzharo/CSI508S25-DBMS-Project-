// client/src/components/ui/Input.jsx
// import React from "react";

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  className,
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`} // Handle potentially undefined className
      {...props}
    />
  );
}
