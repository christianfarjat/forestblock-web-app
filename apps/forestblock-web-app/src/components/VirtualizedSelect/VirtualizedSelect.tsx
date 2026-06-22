'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { FixedSizeList, FixedSizeListProps, ListChildComponentProps } from 'react-window';
import { VirtualizedSelectProps } from '../MultiStepCalculator/steps/types';

const List = FixedSizeList as unknown as React.ComponentType<
  FixedSizeListProps<any> //eslint-disable-line @typescript-eslint/no-explicit-any
>;

const VirtualizedSelect: React.FC<VirtualizedSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [itemSize, setItemSize] = useState<number>(40);

  useEffect(() => {
    const handleResize = () => {
      setItemSize(window.innerWidth < 640 ? 60 : 40);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 4] } },
      { name: 'preventOverflow', options: { rootBoundary: 'viewport' } },
      { name: 'flip', enabled: false },
    ],
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        referenceElement?.contains(e.target as Node) ||
        popperElement?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [referenceElement, popperElement]);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = filterTerm
    ? options.filter((opt) => opt.label.toLowerCase().includes(filterTerm.toLowerCase()))
    : options;

  const Row = ({ index, style }: ListChildComponentProps) => {
    const opt = filteredOptions[index];
    return (
      <div
        style={style}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-normal break-words text-sm md:text-base rounded-full"
        onClick={() => {
          onChange(opt.value);
          setIsOpen(false);
          setFilterTerm('');
        }}
      >
        {opt.label}
      </div>
    );
  };

  return (
    <div className="relative inline-block w-full">
      <button
        ref={setReferenceElement}
        type="button"
        className="border p-2 w-full text-left bg-white rounded-full text-customGray text-sm md:text-base"
        onClick={() => setIsOpen((o) => !o)}
      >
        {selectedOption ? selectedOption.label : placeholder || 'Select...'}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={setPopperElement}
            style={{ ...styles.popper, width: referenceElement?.offsetWidth }}
            {...attributes.popper}
            className="bg-white border overflow-auto shadow-lg pointer-events-auto z-50 divide-y divide-gray-200"
            role="listbox"
          >
            {/* Search input */}
            <input
              type="text"
              className="w-full p-2 border-b"
              placeholder="Buscar..."
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />

            {/* Virtualized list */}
            {filteredOptions.length > 0 ? (
              <List
                height={Math.min(filteredOptions.length * itemSize, 300)}
                itemCount={filteredOptions.length}
                itemSize={itemSize}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              <div className="p-2 text-gray-500">No hay resultados.</div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default VirtualizedSelect;
