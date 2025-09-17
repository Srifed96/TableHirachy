import React, { useState } from "react";

const dummyData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1400,
      originalValue: 1400,
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
          originalValue: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
          originalValue: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
          originalValue: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
          originalValue: 700,
        },
      ],
    },
  ],
};

function App() {
  const [tableData, setTableData] = useState<any>(dummyData.rows);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const recalcSubtotals = (items: any[]): number => {
    return items.reduce((sum, item) => {
      if (item.children) {
        item.value = recalcSubtotals(item.children);
      }
      return sum + item.value;
    }, 0);
  };

  const updateValue = (items: any[], id: string, newValue: number): any[] => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, value: newValue };
      } else if (item.children) {
        return { ...item, children: updateValue(item.children, id, newValue) };
      }
      return item;
    });
  };

  const handleAllocation = (item: any, mode: "percent" | "value") => {
    let input = inputs[item.id];
    if (!input) return;

    let newValue = item.value;
    if (mode === "percent") {
      newValue = item.value + (item.value * input) / 100;
    } else {
      newValue = input;
    }

    let updated = updateValue(tableData, item.id, newValue);
    recalcSubtotals(updated);
    setTableData([...updated]);
  };

  const renderRows = (items: any[], level = 0) =>
    items.map((item) => (
      <React.Fragment key={item.id}>
        <tr>
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
            <button onClick={() => handleAllocation(item, "percent")}>
              button1
            </button>
          </td>
          <td>
            <button onClick={() => handleAllocation(item, "value")}>
              button2
            </button>
          </td>
          <td>
            {(
              ((item.value - item.originalValue) / item.originalValue) *
              100
            ).toFixed(2)}{" "}
            %
          </td>
        </tr>
        {item.children && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));

  return (
    <div className="tableContainer">
      <table border={1} cellPadding={5}>
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
}

export default App;
