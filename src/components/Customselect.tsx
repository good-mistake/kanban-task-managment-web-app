import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface CustomSelectProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

const Customselect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownStyle, setDropdownStyle] = useState({
    width: 0,
    left: 0,
    top: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };
  const updateDropdownPosition = () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const dropdownHeight = 150;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenAbove =
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

    setDropdownStyle({
      top: shouldOpenAbove
        ? rect.top + window.scrollY - dropdownHeight - 4
        : rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);
  console.log(isOpen);
  return (
    <div className={`selectWrapper`} ref={ref}>
      <div className={`selected`} onClick={() => setIsOpen((prev) => !prev)}>
        <span>{value}</span>
        <Image
          src="/assets/icon-chevron-down.svg"
          alt="chevron"
          width={12}
          height={12}
          className={`${`chevron`} ${isOpen ? `rotate` : ""}`}
        />{" "}
      </div>
      {createPortal(
        <div
          ref={dropdownRef}
          className={`options ${isOpen ? "visible" : ""}`}
          style={{
            top: dropdownStyle.top,
            left: dropdownStyle.left,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            width: dropdownStyle.width,
            maxHeight: "150px",
            overflowY: "auto",
            overflowX: "hidden",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`${`option`} ${option === value ? `active` : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>,
        document.getElementById("modal-root")!
      )}
    </div>
  );
};

export default Customselect;
