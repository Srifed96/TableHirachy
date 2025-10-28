import React, { useState } from "react";
import "..//App.css";

interface Item {
  id: string;
  label: string;
  value: number;
  originalValue: number;
  children?: Item[];
}

const dummyData: { rows: Item[] } = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1400,
      originalValue: 1400,
      children: [
        { id: "phones", label: "Phones", value: 800, originalValue: 800 },
        { id: "laptops", label: "Laptops", value: 700, originalValue: 700 },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      children: [
        { id: "tables", label: "Tables", value: 300, originalValue: 300 },
        { id: "chairs", label: "Chairs", value: 700, originalValue: 700 },
      ],
    },
  ],
};

const App: React.FC = () => {
  const [tableData, setTableData] = useState<Item[]>(dummyData.rows);
  const [inputs, setInputs] = useState<Record<string, number>>({});

  const recalcSubtotals = (items: Item[]): number => {
    return items.reduce((sum, item) => {
      if (item.children) {
        item.value = recalcSubtotals(item.children);
      }
      return sum + item.value;
    }, 0);
  };

  const updateValue = (items: Item[], id: string, newValue: number): Item[] => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, value: newValue };
      } else if (item.children) {
        return { ...item, children: updateValue(item.children, id, newValue) };
      }
      return item;
    });
  };

  const handleAllocation = (item: Item, mode: "percent" | "value") => {
    const input = inputs[item.id];
    if (input === undefined || input === null || isNaN(input)) return;

    let newValue = item.value;
    if (mode === "percent") {
      newValue = item.value + (item.value * input) / 100;
    } else {
      newValue = input;
    }

    const updated = updateValue(tableData, item.id, newValue);
    recalcSubtotals(updated);
    setTableData([...updated]);
  };

  const renderRows = (items: Item[], level = 0): JSX.Element[] => {
    return items.flatMap((item) => [
      <tr key={item.id}>
        <td style={{ paddingLeft: `${level * 20}px` }}>{item.label}</td>
        <td>{item.value}</td>
        <td>
          <input
            type="number"
            value={inputs[item.id] ?? ""}
            onChange={(e) =>
              setInputs({ ...inputs, [item.id]: Number(e.target.value) })
            }
          />
        </td>
        <td>
          <button onClick={() => handleAllocation(item, "percent")}>%</button>
        </td>
        <td>
          <button onClick={() => handleAllocation(item, "value")}>Val</button>
        </td>
        <td>
          {(
            ((item.value - item.originalValue) / item.originalValue) *
            100
          ).toFixed(2)}{" "}
          %
        </td>
      </tr>,
      ...(item.children ? renderRows(item.children, level + 1) : []),
    ]);
  };

  return (
    <div className="app-container">
      <h2>Simple Hierarchical Table Website</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>{renderRows(tableData)}</tbody>
      </table>
    </div>
  );
};

export default App;
