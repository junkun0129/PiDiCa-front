import { ATTEND_SPECIAL_STATUS } from "../const";

export const COLORIZE = (
  start: string,
  end: string,
  rest: number,
  over: number
) => {
  if (!start || !end) return "";
  if (!start.includes(":") || !end.includes(":")) return "";
  const [hour, min] = start.split(":");
  const [hour2, min2] = end.split(":");
  if (isNaN(parseInt(hour)) || isNaN(parseInt(min))) return "";
  if (isNaN(parseInt(hour2)) || isNaN(parseInt(min2))) return "";
  let diff =
    parseInt(hour) * 60 +
    parseInt(min) -
    (parseInt(hour2) * 60 + parseInt(min2));
  if (typeof rest === "number") diff -= rest;
  if (typeof over === "number") diff += over;
  return diff;
};
export const generateRowsFromDate = (date: number) => {
  let rowObject: { [key: number]: { [key: string]: string } } = {};
  for (let i = 1; i <= date; i++) {
    rowObject[i - 1] = { title: `${i}日` };
  }
  rowObject[date] = { title: "合計" };
  return rowObject;
};

export const generateCellsData = (maxDate: number) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G"];
  const dataArray: string[][] = [];
  for (let i = 1; i <= maxDate; i++) {
    const row: string[] = columns.map((alphabet) => {
      if (alphabet === "F") {
        return `=COLORIZE(B${i},A${i},C${i},D${i})`;
      }
      return "";
    });
    dataArray.push(row);
  }
  dataArray.push([
    "",
    "",
    "",
    `=SUM(D1:D${maxDate})`,
    `=SUM(E1:E${maxDate})`,
    `=SUM(F1:F${maxDate})`,
    "ー",
  ]);
  return dataArray;
};

export const generateColumns = (isSubmitted: boolean) => [
  { type: clockEditor, title: "開始時間", readOnly: isSubmitted },
  { type: clockEditor, title: "終了時間", readOnly: isSubmitted },
  { type: "text", title: "休憩時間", mask: "#,## 分 ", readOnly: isSubmitted },
  {
    type: "number",
    title: "残業時間",
    mask: "#,## 分 ",
    readOnly: isSubmitted,
  },
  {
    type: "number",
    title: "深夜残業時間",
    mask: "#,## 分 ",
    readOnly: isSubmitted,
  },
  {
    type: "number",
    title: "勤務時間",
    mask: "#,## 分 ",
    readOnly: isSubmitted,
  },
  {
    type: "dropdown",
    title: "特別理由",
    source: ["早退", "遅刻", "有給", "欠勤", "その他"],
    readOnly: isSubmitted,
  },
];

export const SPREAD_ROW_INDEX = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
};

export const validateSubmitData = (
  data: string[][]
): {
  isSuccess: boolean;
  message?: string;
  indexes?: { row: number; col: number };
  value?: string | number[][];
} => {
  let returnValue: string | number[][] = [];

  for (let rowIndex = 1; rowIndex <= data.length; rowIndex++) {
    let rowValue: string | number[] = [];

    for (let colIndex = 1; colIndex <= data[rowIndex - 1].length; colIndex++) {
      let cell = data[rowIndex - 1][colIndex - 1];
      let returnCellValue: number | string = cell;

      if (returnCellValue && returnCellValue !== "") {
        if (colIndex === 1 || colIndex === 2) {
          if (cell.includes(":")) {
            const splitValue = cell.split(":");
            if (
              isNaN(parseInt(splitValue[0])) ||
              isNaN(parseInt(splitValue[1]))
            ) {
              return {
                isSuccess: false,
                message: "開始時間と終了時間の列に不適切な値があります。",
                indexes: { row: rowIndex, col: colIndex },
              };
            }
            returnCellValue = cell + ":00";
          } else {
            return {
              isSuccess: false,
              message: "開始時間と終了時間の列に不適切な値があります。",
              indexes: { row: rowIndex, col: colIndex },
            };
          }
        }

        if ([3, 4, 5, 6].includes(colIndex)) {
          if (cell.includes(" ")) {
            const parsedValue = parseInt(cell.split(" ")[0].replace(/,/g, ""));
            if (isNaN(parsedValue)) {
              return {
                isSuccess: false,
                message:
                  "休憩時間、残業時間、深夜残業時間、勤務時間の列に不適切な値があります。",
                indexes: { row: rowIndex, col: colIndex },
              };
            }
            returnCellValue = parsedValue;
          } else {
            return {
              isSuccess: false,
              message:
                "休憩時間、残業時間、深夜残業時間、勤務時間の列に不適切な値があります。",
              indexes: { row: rowIndex, col: colIndex },
            };
          }
        }

        if (colIndex === 7) {
          if (!Object.keys(ATTEND_SPECIAL_STATUS).includes(cell)) {
            return {
              isSuccess: false,
              message: "特別理由の列に不適切な値があります。",
              indexes: { row: rowIndex, col: colIndex },
            };
          }
          returnCellValue =
            ATTEND_SPECIAL_STATUS[cell as keyof typeof ATTEND_SPECIAL_STATUS];
        }
      }

      if (!returnCellValue) {
        if (colIndex === 1 || colIndex === 2) {
          returnCellValue = "00:00";
        } else if (colIndex === 7) {
          returnCellValue = "";
        } else {
          returnCellValue = 0;
        }
      }
      rowValue.push(typeof returnCellValue === "number" ? returnCellValue : 0);
    }
    returnValue.push(rowValue);
  }

  return { isSuccess: true, value: returnValue };
};

const clockEditor = (() => {
  const editor = document.createElement("div");
  editor.classList.add("clock-editor");
  editor.style.cssText =
    "position: relative; padding: 8px; background: white; border: 1px solid #ddd;";

  const hourSelect = document.createElement("select");
  const minuteSelect = document.createElement("select");
  const separator = document.createElement("span");
  separator.textContent = ":";
  separator.style.margin = "0 4px";

  for (let i = 0; i < 24; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    hourSelect.appendChild(option);
  }

  for (let i = 0; i < 60; i += 5) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    minuteSelect.appendChild(option);
  }

  const selectStyle =
    "padding: 4px; border: 1px solid #ddd; border-radius: 4px; width: 60px;";
  hourSelect.style.cssText = selectStyle;
  minuteSelect.style.cssText = selectStyle;

  editor.appendChild(hourSelect);
  editor.appendChild(separator);
  editor.appendChild(minuteSelect);

  let closeCallback: null | (() => void) = null;

  const handleChange = () => {
    if (closeCallback) closeCallback();
  };

  hourSelect.addEventListener("change", handleChange);
  minuteSelect.addEventListener("change", handleChange);

  const methods: Editor = {
    createCell: (cell, value) => {
      cell.innerHTML = value || "";
    },
    updateCell: (cell, value) => {
      if (cell) cell.innerHTML = value || "";
    },
    openEditor: (cell, value, x, y, instance) => {
      instance.parent.input.innerHTML = "";
      (instance as any).parent.input.setAttribute("contentEditable", false);
      instance.parent.input.appendChild(editor);

      if (value) {
        const [hours, minutes] = value.split(":");
        hourSelect.value = hours;
        minuteSelect.value = minutes;
      }

      hourSelect.focus();
      closeCallback = () => instance.closeEditor(cell, true);
    },
    closeEditor: (cell, save) => {
      if (save) return `${hourSelect.value}:${minuteSelect.value}`;
      return "";
    },
  };

  return methods;
})();
