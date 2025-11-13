"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  UniqueIdentifier,
} from "@dnd-kit/core";

// ---------------- Types ----------------
type FieldType = "input" | "textarea" | "select";

interface Field {
  id: string;
  label: string;
  type: FieldType;
}

type Cell = Field[]; // each cell can have multiple fields
type Row = Cell[];
type Rows = Row[];

// ---------------- Available fields ----------------
const availableFields: Field[] = [
  { id: "input", label: "Text Input", type: "input" },
  { id: "textarea", label: "Textarea", type: "textarea" },
  { id: "select", label: "Select", type: "select" },
];

// ---------------- Draggable field ----------------
interface DraggableFieldProps {
  field: Field;
}

function DraggableField({ field }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: field.id + Math.random(), // unique ID for multiple drags
    data: { field },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="border p-2 rounded bg-white cursor-grab shadow hover:bg-gray-50"
    >
      {field.label}
    </div>
  );
}

// ---------------- Droppable cell ----------------
interface DroppableCellProps {
  rowIndex: number;
  colIndex: number;
  fields: Cell;
}

function DroppableCell({ rowIndex, colIndex, fields }: DroppableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${rowIndex}-${colIndex}` as UniqueIdentifier,
    data: { rowIndex, colIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-72 min-h-24 border flex flex-col items-center justify-center rounded transition-colors
        ${isOver ? "bg-blue-100 border-blue-400" : "bg-gray-50"}`}
    >
      {fields.length === 0 && (
        <span className="text-gray-400 text-sm">Drop field here</span>
      )}
      {fields.map((field, idx) =>
        field ? (
          field.type === "input" ? (
            <input
              key={idx}
              type="text"
              placeholder="Text Input"
              className="border px-2 py-1 rounded w-54 my-1"
            />
          ) : field.type === "textarea" ? (
            <textarea
              key={idx}
              placeholder="Textarea"
              className="border px-2 py-1 rounded w-54 h-16 resize-none my-1"
            />
          ) : field.type === "select" ? (
            <select
              key={idx}
              className="border px-2 py-1 rounded w-54 my-1"
            >
              <option>Select option</option>
              <option>Option A</option>
              <option>Option B</option>
            </select>
          ) : null
        ) : null
      )}
    </div>
  );
}

// ---------------- Main Dynamic Form Builder ----------------
export default function DynamicFormBuilder() {
  const [rows, setRows] = useState<Rows>([[[]]]);
  const [activeField, setActiveField] = useState<Field | null>(null);

  // --- Row & Column management ---
  const addRow = (cols: number = 2) =>
    setRows([...rows, Array(cols).fill(0).map(() => [])]);

  const removeRow = (rowIndex: number) =>
    setRows(rows.filter((_, i) => i !== rowIndex));

  const addColumn = (rowIndex: number) =>
    setRows(
      rows.map((row, idx) => (idx === rowIndex ? [...row, []] : row))
    );

  const removeColumn = (rowIndex: number) =>
    setRows(
      rows.map((row, idx) =>
        idx === rowIndex && row.length > 1 ? row.slice(0, -1) : row
      )
    );

  // --- Drag & Drop ---
  const handleDrop = (event: DragEndEvent) => {
    const over = event.over;
    const active = event.active;
    if (!over || !active || !activeField) {
      setActiveField(null);
      return;
    }

    const { rowIndex, colIndex } = over.data.current as {
      rowIndex: number;
      colIndex: number;
    };

    // push field into cell (do not replace)
    setRows((prev) =>
      prev.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? [...cell, activeField] : cell
        )
      )
    );

    setActiveField(null);
  };

  return (
    <DndContext
      onDragStart={(event) => {
        const field = event.active.data.current?.field;
        setActiveField(field || null);
      }}
      onDragEnd={handleDrop}
    >
      <div className="flex gap-8 p-2">
        {/* Sidebar */}
        <div className="w-40 flex flex-col gap-2">
          <h3 className="font-semibold mb-2">Form Fields</h3>
          {availableFields.map((field) => (
            <DraggableField key={field.id} field={field} />
          ))}
        </div>

        {/* Form Grid */}
        <div className="flex flex-col gap-4 mt-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                {row.map((cell, colIndex) => (
                  <DroppableCell
                    key={colIndex}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    fields={cell}
                  />
                ))}

                {/* Column & Row buttons */}
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => addColumn(rowIndex)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    +Col
                  </button>
                  <button
                    onClick={() => removeColumn(rowIndex)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    -Col
                  </button>
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm mt-1"
                  >
                    -Row
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Row buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => addRow(2)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Row (2 cols)
            </button>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeField ? (
          <div className="border p-2 rounded bg-white shadow">
            {activeField.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
