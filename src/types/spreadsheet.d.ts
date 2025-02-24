interface Editor {
  /** createCell  When a new cell is created. */
  createCell: (
    cell: HTMLElement,
    value: any,
    x: number,
    y: number,
    instance: worksheetInstance,
    options: object
  ) => any;
  /** updateCell  When the cell value changes. */
  updateCell: (
    cell: HTMLElement,
    value: any,
    x: number,
    y: number,
    instance: worksheetInstance,
    options: object
  ) => any;
  /** openEditor  When the user starts the edition of a cell. */
  openEditor: (
    cell: HTMLElement,
    value: any,
    x: number,
    y: number,
    instance: worksheetInstance,
    options: object
  ) => any;
  /** closeEditor When the user finalizes the edition of a cell. */
  closeEditor: (
    cell: HTMLElement,
    confirmChanges: boolean,
    x: number,
    y: number,
    instance: worksheetInstance,
    options: object
  ) => any;
  /** When a cell is destroyed. */
}

interface spreadsheetInstance {
  /** Spreadsheet configuration */
  config: Spreadsheet;
  /** Contextmenu HTMLElement */
  contextmenu: HTMLElement;
  /** Create a new worksheet from the given settings */
  createWorksheet: (options: Worksheet) => worksheetInstance;
  /** Delete an existing worksheet by its position */
  deleteWorksheet: (position: number) => void;
  /** DOM Element */
  el: HTMLElement;
  /** DOM Element. Alias for el */
  element: HTMLElement;
  /** DOM Element container for the filters */
  filter: HTMLElement;
  /** Toggle the full screen mode */
  fullscreen: (state: Boolean) => void;
  /** Get the toolbar object definitions */
  getToolbar: (toolbar: Toolbar) => object;
  /** Set the toolbar */
  setToolbar: (toolbar: Toolbar) => void;
  /** Show the toolbar */
  showToolbar: () => void;
  /** Hide the toolbar */
  hideToolbar: () => void;
  /** Get the worksheet index by instance or worksheet instance by index */
  getWorksheet: (worksheetIdent: worksheetInstance | number) => number | string;
  /** Get the active worksheet when applicable */
  getWorksheetActive: () => number;
  /** Get the worksheet instance by its position */
  getWorksheetInstance: (position: number) => worksheetInstance;
  /** HTMLElement Helper */
  helper: HTMLElement;
  /** Array with the history information */
  history: [];
  /** Internal history index position */
  historyIndex: number;
  /** Ignore events */
  ignoreEvents: boolean;
  /** Ignore history events */
  ignoreHistory: boolean;
  /** Ignore persistence events */
  ignorePersistence: boolean;
  /** HTMLElement editor container */
  input: HTMLElement;
  /** HTMLElement loading element */
  loading: HTMLElement;
  /** Rename an existing worksheet by its position */
  renameWorksheet: (position: number, title: string) => void;
  /** Move the position of a worksheet */
  updateWorksheet: (from: number, to: number) => void;
  /** Move the position of a worksheet. DOM Only (Internal method) - Please use updateWorksheet */
  moveWorksheet: (from: number, to: number) => void;
  /** Open a worksheet */
  openWorksheet: (position: number) => void;
  /** Spreadsheet unique name */
  name: string;
  /** List of plugins loaded to the spreadsheet */
  plugins: Record<string, Plugin>;
  /** Processing flag. It would be true when the spreadsheet is loading. */
  processing: boolean;
  /** Show progressbar */
  progress: (state: boolean) => void;
  /** Queue of formulas used during the loading */
  queue: Array<string>;
  /** Undo */
  undo: () => void;
  /** Redo */
  redo: () => void;
  /** DOM Textarea helper */
  textarea: HTMLElement;
  /** DOM toolbar */
  toolbar: HTMLElement;
  /** Tools HTMLElement container */
  tools: HTMLElement;
  /** Worksheets container */
  worksheets: Array<Worksheet>;
  /** Load plugins into the spreadsheet */
  setPlugins: (plugins: Record<string, Function>) => void;
  /** Internal history handlers */
  setHistory: (history: object) => void;
  /** Internal history handlers */
  resetHistory: () => void;
  /** Internal method: event dispatch controllers. */
  dispatch: (...args: string[]) => void;
  /** Get the spreadsheet configuration */
  getConfig: () => Spreadsheet;
}

interface worksheetInstance {
  /** Array with the borders information */
  borders: Border[];
  /** Close the editon for one cell */
  closeEditor: (cell: HTMLElement, save: boolean) => void;
  /** Close the filters */
  closeFilters: (update: boolean) => void;
  /** Array with the HTML element references that define the columns */
  colgroup: HTMLElement[];
  /** Hold the colgroup container */
  colgroupContainer: HTMLElement;
  /** DOM Worksheet container */
  content: HTMLElement;
  /** Copy */
  copy: (cut?: boolean) => void;
  /** HTML Element for the handler fill */
  corner: HTMLElement;
  /** Create a new worksheet */
  createWorksheet: (worksheetOptions: Worksheet) => worksheetInstance;
  /** Internal selected cell */
  cursor: object;
  /** Cut */
  cut: () => void;
  /** Alias to getData */
  data: (
    highlighted?: boolean,
    processed?: boolean,
    delimiter?: string,
    asJson?: boolean
  ) => Array<Array<any>> | Array<Record<string, any>> | string | null;
  /** Internal use control type to defined JSON (1) or ARRAY (0). */
  dataType: number;
  /** Delete an existing column */
  deleteColumn: (columnnumber: number, numOfColumns?: number) => void;
  /** Delete an existing row */
  deleteRow: (rownumber: number, numOfRows?: number) => void;
  /** Destroy all merged cells */
  destroyMerged: () => void;
  /** Legacy alias destroyMerged */
  destroyMerge: () => void;
  /** Internal method: event dispatch controllers. */
  dispatch: (...args: string[]) => void;
  /** Navigation down */
  down: (shiftKey?: boolean, ctrlKey?: boolean, jump?: boolean) => void;
  /** If extension render exists, execute render extension else download CSV */
  download: (includeHeaders?: boolean, processed?: boolean) => void;
  /** Download CSV */
  downloadCSV: (includeHeaders?: boolean, processed?: boolean) => void;
  /** Edition controllers */
  edition?: [];
  /** DOM Worksheet. Alias for worksheet */
  element: HTMLElement;
  /** Internal method: Execute a formula. */
  executeFormula: (
    expression: string,
    x?: number,
    y?: number,
    caching?: boolean,
    basic?: boolean
  ) => void;
  /** Navigation first */
  first: (shiftKey?: boolean, ctrlKey?: boolean) => void;
  /** Internal footer controllers */
  footers: Record<string, string>;
  /** Internal formula chain controllers */
  formula: [];
  /** Toggle the fullscreen mode */
  fullscreen: (state: boolean) => void;
  /** Get the border */
  getBorder: (alias: string) => object;
  /** Get the cell element from the cellName or via its coordinates x,y */
  getCell: (
    cellNameOrColumnNumber: string | number,
    y?: number
  ) => HTMLElement | null;
  /** Alias to getCell */
  getCellFromCoords: (x: number, y: number) => HTMLElement | null;
  /** Get attributes from one cell when applicable */
  getCells: (cellName: string) => Column;
  /** Get the column object by its position */
  getColumn: (position: number) => Column;
  /** Get the column data from its number */
  getColumnData: (col: number, processed?: boolean) => Array<any>;
  /** Get the column position by its name */
  getColumnIdByName: (name: string) => number;
  /** Alias for getProperties */
  getColumnOptions: (x: number, y?: number) => Column;
  /** Get the comments from one cell. Example: getComments('A1') */
  getComments: (cellName?: string) => string;
  /** Get the worksheet settings */
  getConfig: () => Worksheet;
  /**
   * Get the worksheet data
   *
   * @param {boolean} only the selected cells
   * @param {boolean} get the raw or processed data
   * @param {string} delimiter to get the data as a string with columns separate by the char delimiter.
   * @param {boolean} get the data as a JSON object.
   * @return {array|string|null} array or string
   */
  getData: (
    highlighted?: boolean,
    processed?: boolean,
    delimiter?: string,
    asJson?: boolean
  ) => Array<Array<any>> | Array<Record<string, any>> | string | null;
  /** Get the defined name or all defined names when key is null */
  getDefinedNames: (key?: string) => object;
  /** Internal method: Get the editor for one cell */
  getEditor: (x: number, y: number) => Column;
  /** Internal method: Get the filter */
  getFilter: (column: number) => Array<any>;
  /** Get the footers configuration */
  getFooter: () => Array<any>;
  /** Get the footer value */
  getFooterValue: (x: number, y: number) => any;
  /** Get the header title */
  getHeader: (columnNumber: number) => string;
  /** Get all header elements */
  getHeaders: (asArray: boolean) => Array<any>;
  /** Get the height of one row by its position when height is defined. */
  getHeight: (row?: number) => Array<number> | number;
  /** Get the highlighted coordinates */
  getHighlighted: () => Array<any>;
  /** Get the data as JSON. */
  getJson: (
    h?: boolean,
    processed?: boolean,
    delimiter?: boolean,
    asJson?: boolean
  ) => any;
  /** Get the processed data cell shown to the user by the cell name or coordinates. */
  getLabel: (
    cellNameOrColumnNumber: string | number,
    y?: number,
    extended?: boolean
  ) => string;
  /** Aliases for getLabel */
  getLabelFromCoords: (
    cellNameOrColumnNumber: string | number,
    y?: number,
    extended?: boolean
  ) => string;
  /** Get the merged cells. Cell name: A1, A2, etc or null for all cells */
  getMerge: (cellName?: string) => object | Array<number>;
  /** Get one or all meta information for one cell. */
  getMeta: (cellName: string, property: string) => object;
  /** Get the nested cells */
  getNestedCell: (x: number, y: number, properties?: any) => object;
  /** Get the nested headers */
  getNestedHeaders: () => [];
  /** Get the next available number in the sequence */
  getNextSequence: () => number;
  /** Alias to getProperty */
  getOptions: (x: number, y?: number) => Column;
  /** Get the primaryKey column when applicable. */
  getPrimaryKey: () => number;
  /** Get processed data by the coordinates of the cell. Extended process a color, progressbar and rating as raw. */
  getProcessed: (x: number, y: number, extended?: boolean) => any;
  /** Get the properties for one column when only x is present or the cell when x and y is defined. */
  getProperties: (x: number, y?: number) => Column;
  /** Deprecated. Legacy alias to getProperties */
  getProperty: (x: number, y?: number) => Column;
  /** Get the selection in a range format */
  getRange: () => string;
  /** Get a row data or meta information by Id. */
  getRowById: (row: number, element: boolean) => Row;
  /** Get the data from one row */
  getRowData: (row: number, processed: boolean) => any[];
  /** Get the row id from its position */
  getRowId: (row: number) => number;
  /**
   * Get the selected cells
   * @param {boolean} columnNameOnly - Return an array of cell names or cell DOM elements
   * @param {boolean} ignoreHidden - Ignore hidden cells
   */
  getSelected: (columnNameOnly: boolean, ignoreHidden?: boolean) => any[];
  /** Get the selected columns indexes */
  getSelectedColumns: () => number[];
  /** Get the selected rows. DOMElements or Indexes */
  getSelectedRows: (indexes?: boolean) => HTMLElement[] | number[];
  /** Get the style from a cell or all cells. getStyle() or getStyle('A1') */
  getStyle: (cellName?: string | null) => string | object;
  /** Get value by the cell name or object. The value can be the raw or processed value. */
  getValue: (cell: string, processed: boolean) => string;
  /** Get value by the coordinates. The value can be the raw or processed value. */
  getValueFromCoords: (x: number, y: number, processed: boolean) => any;
  /** Get the width of one column by index or all column width as an array when index is null. */
  getWidth: (x?: number) => Array<number> | number;
  /** Go to the row number, [col number] */
  goto: (y: number, x?: number) => void;
  /** Hold the header container */
  headerContainer: HTMLElement;
  /** Array with the header DOM elements */
  headers: Array<HTMLElement>;
  /** Hide column */
  hideColumn: (column: number | number[]) => void;
  /** Hide the filters from one or all columns. */
  hideFilter: (colNumber?: number) => void;
  /** Hide index column */
  hideIndex: () => void;
  /** Hide row */
  hideRow: (row: number | number[]) => void;
  /** Hide the search container */
  hideSearch: () => void;
  /** Add a new column */
  insertColumn: (
    numOfColOrData?: number | any[],
    columnNumber?: number,
    insertBefore?: boolean,
    properties?: Column,
    data?: any[] | any[][] | null,
    extraInformationFromEvents?: object,
    mouseEvent?: object
  ) => void;
  /** Add a new row */
  insertRow: (
    numOfRowsOrData?: number | any[],
    rowNumber?: number,
    insertBefore?: boolean,
    data?: any[] | any[][] | null,
    mouseEvent?: object
  ) => void;
  /** Check if cell is attached to the DOM */
  isAttached: (x: number, y: number) => boolean;
  /** The worksheet is editable */
  isEditable: () => boolean;
  /** Check if cell is readonly or not. State used to set the state */
  isReadOnly: (cellName: string, state?: boolean) => boolean;
  /** Verify if this coordinates is within a selection or blank for the current selection */
  isSelected: (x: number, y: number, selection?: number[]) => boolean;
  /** Navigation last */
  last: (shiftKey?: boolean, ctrlKey?: boolean) => void;
  /** Navigation left */
  left: (shiftKey?: boolean, ctrlKey?: boolean, jump?: boolean) => void;
  /** Dynamic load data to the spreadsheet. This method does not trigger events or persistence and reset the spreadsheet. To persist use setData. */
  loadData: (data: any[]) => void;
  /** Change a column position */
  moveColumn: (from: number, to: number) => void;
  /** Change a row position */
  moveRow: (from: number, to: number) => void;
  /** Get the column name */
  name: (col: number) => string;
  /** Start the edition for one cell */
  openEditor: (cell: HTMLElement, empty?: boolean, mouseEvent?: object) => void;
  /** Open the filters */
  openFilter: (column: number) => void;
  /** Worksheet configuration */
  options: Worksheet;
  /** Sort one column by its position. ASC (0) or DESC (1) */
  orderBy: (
    column: number,
    direction: boolean,
    internalValueController?: any[],
    internalPreviousStateController?: boolean
  ) => void;
  /** Change page when using pagination */
  page: (pageNumber: number, callBack?: Function) => void;
  /** Current page number */
  pageNumber: number;
  /** Pagination DOM container */
  pagination: HTMLElement;
  /** Spreadsheet object */
  parent: spreadsheetInstance;
  /** Paste */
  paste: (x: number, y: number, data: string | any[]) => void;
  /** Get the quantity of pages when pagination is active */
  quantityOfPages?: () => number;
  /** Array container for all cell DOM elements */
  records: Records[][];
  /** Refresh the whole data or from a single row  */
  refresh: (y: number | undefined) => void;
  /** Refresh the borders by the border name */
  refreshBorders: (border?: string) => void;
  /** Refresh footers */
  refreshFooter: () => void;
  /** Remove the merged cells by the cell name or a object with all cells to be removed. */
  removeMerge: (cellName: string | object) => void;
  /** Reset the borders by name border name */
  resetBorders: (border: string, resetPosition: boolean) => void;
  /** Reset the filter of one or all columns */
  resetFilters: (colNumber?: number) => void;
  /** Destroy the footers */
  resetFooter: () => void;
  /** Destroy freeze columns */
  resetFreezeColumns: () => void;
  /** Reset meta data of one or multiple cells. Null for all cells */
  resetMeta: (cellName?: string[] | string) => void;
  /** Reset nested headers */
  resetNestedHeaders: () => void;
  /** Reset the search */
  resetSearch: () => void;
  /** Reset the main selection */
  resetSelection: () => void;
  /** Get the style from one cell. Ex. resetStyle('A1') */
  resetStyle: (cell?: string) => void;
  /** DOM array of results */
  results: Array<number> | null;
  /** Navigation right */
  right: (shiftKey?: boolean, ctrlKey?: boolean, jump?: boolean) => void;
  /** Rotate the spreadsheet cell text. cell = A1, B1... etc */
  rotate: (cell: string | string[], value: number) => void;
  /** Array of row objects */
  rows: RowInstance[] | Record<number, RowInstance>;
  /** Persistence helper method. The callback is executed with a JSON from the server */
  save: (
    url: string,
    data: object,
    token?: string,
    callback?: (result: object) => void
  ) => void;
  /** ScrollX DOM Element */
  scrollX: HTMLElement;
  /** ScrollY DOM Element */
  scrollY: HTMLElement;
  /** Search for something */
  search: (str: string) => void;
  /** Search HTML container */
  searchContainer: HTMLElement;
  /** Search HTML input */
  searchInput: HTMLElement;
  /** Select All */
  selectAll: () => void;
  /** Selected cells */
  selectedCell: any[];
  /** Internal record id sequence */
  sequence: number;
  /** Set borders with a border name and color. */
  setBorder: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    border?: string,
    color?: string
  ) => void;
  /** Set attributes for one cell */
  setCells: (cellName: string, settings: Column) => void;
  /** Set the column data from its number */
  setColumnData: (col: number, data: any[], force?: boolean) => void;
  /** Set the comments for one cell */
  setComments: (cellName: string, comments: string) => void;
  /** Change the worksheet settings */
  setConfig: (config: Worksheet) => void;
  /** Set the worksheet data */
  setData: (data: any[]) => void;
  /** Set the defined name */
  setDefinedNames: (names: DefinedNames[]) => void;
  /** Set filter */
  setFilter: (colNumber: number, keywords: any[]) => void;
  /** Set the footers */
  setFooter: (data: []) => void;
  /** Set the footer value */
  setFooterValue: (col: number, row: number, value: any) => void;
  /** Freeze x number of columns */
  setFreezeColumns: (num: number) => void;
  /** Set the header title. Empty or null to reset to the default header value. */
  setHeader: (x: number, title?: string) => void;
  /** Set the height of one row by its position. currentHeight is for internal use only */
  setHeight: (
    row: number | number[],
    height: number | number[],
    currentHeight?: number | number[]
  ) => void;
  /** Get the merged cells. Cell name: A1, A2, etc */
  setMerge: (
    cellName: string | object,
    colspan?: number,
    rowspan?: number
  ) => void;
  /** Get one or various meta information for one cell. */
  setMeta: (cell: string | object, property?: string, value?: string) => void;
  /** Set the nested headers */
  setNestedHeaders: (config: any[]) => void;
  /** Deprecated. Alias for parent.setPlugins */
  setPlugins: (plugins: Record<string, Function>) => void;
  /** Set the properties for a column or cell */
  setProperties: (
    columnNumber: number,
    rowNumberOrColumnSettings: number | Column,
    settings?: Column
  ) => void;
  /** Set or reset the cell as readonly */
  setReadOnly: (cellName: string, state: boolean) => void;
  /** Set the data from one row */
  setRowData: (row: number, data: any[], force: boolean) => void;
  /** Set the row id from its position */
  setRowId: (row: number, newId: number) => void;
  /** Set the style for one cell. Ex. setStyle('A1', 'background-color', 'red') */
  setStyle: (
    cell: string | object,
    property?: string,
    value?: string,
    forceOverwrite?: boolean
  ) => void;
  /**
   * Set a cell value
   *
   * @param {mixed} cell destination cell
   * @param {string|number} value
   * @param {boolean} force value over readonly cells
   * @return void
   */
  setValue: (
    cell: string | string[] | object,
    value?: string | number,
    forceOverwrite?: boolean
  ) => void;
  /**
   * Set a cell value
   *
   * @param {number} x
   * @param {number} y
   * @param {string|number} value value
   * @param {boolean} force value over readonly cells
   * @return void
   */
  setValueFromCoords: (
    x: number,
    y: number,
    value: string | number,
    force?: boolean
  ) => void;
  /** Set viewport width and height */
  setViewport: (width: number, height: number) => void;
  /** Set the width of one column by its position */
  setWidth: (col: number | number[], width: number | number[]) => void;
  /** Show column */
  showColumn: (column: number | number[]) => void;
  /** Show filter controls for one column or all columns */
  showFilter: (column?: number) => void;
  /** Show index column */
  showIndex: () => void;
  /** Show row */
  showRow: (row: number | number[]) => void;
  /** Hide the search container */
  showSearch: () => void;
  /** DOM Worksheet table */
  table: HTMLElement;
  /** DOM Worksheet table thead */
  thead: HTMLElement;
  /** DOM Worksheet table tbody */
  tbody: HTMLElement;
  /** DOM Worksheet table tfoot */
  tfoot: HTMLElement;
  /** Navigation up */
  up: (shiftKey?: boolean, ctrlKey?: boolean, jump?: boolean) => void;
  /**
   * Internal method: Internal method: Set a cell value
   *
   * @param {number} x
   * @param {number} y
   * @param {string} value value
   * @param {string} force value over readonly cells
   * @return void
   */
  updateCell: (x: number, y: number, value: string, force?: boolean) => void;
  /** Internal method: update cells in a batch */
  updateCells: (o: Array<Record<string, object>>) => void;
  /** Update the selection based on two DOM cell elements */
  updateSelection: (
    el1: HTMLElement,
    el2?: HTMLElement,
    origin?: boolean
  ) => void;
  /** Update the selection based on coordinates */
  updateSelectionFromCoords: (
    x1: number,
    y1: number,
    x2?: number,
    y2?: number,
    origin?: boolean,
    type?: string,
    color?: string
  ) => void;
  /** Getter/setter the value by coordinates */
  value?: (x: number, y: number, value?: any) => void;
  /** Which page the row number is */
  whichPage?: (row: number) => number;
  /** Create a new group of rows */
  setRowGroup: (row: number, numOfElements: number) => void;
  /** Open a new group of rows */
  openRowGroup: (row: number) => void;
  /** Close a new group of rows */
  closeRowGroup: (row: number) => void;
  /** Destroy a new group of rows */
  resetRowGroup: (row: number) => void;
  /** Create a new group of columns */
  setColumnGroup: (column: number, numOfElements: number) => void;
  /** Open a new group of columns */
  openColumnGroup: (column: number) => void;
  /** Close a new group of columns */
  closeColumnGroup: (column: number) => void;
  /** Reset a group of columns */
  resetColumnGroup: (column: number) => void;
  /** Resize the given column numbers based on their content. */
  autoResize: (column: number[]) => void;
  /** Aliases for jspreadsheet.helpers. Tools to handle spreadsheet data */
  helpers: Helpers;
  /** Deprecated. Alias for the parent.showToolbar() */
  showToolbar: () => void;
  /** Deprecated. Alias for the parent.hideToolbar() */
  hideToolbar: () => void;
  /** Refresh the toolbar based on the current worksheet */
  refreshToolbar: () => void;
  /** Internal persistence handler */
  persistence: Function;
  /** Deprecated. Alias for parent.undo */
  undo: () => void;
  /** Deprecated. Alias for parent.redo */
  redo: () => void;
  /** Internal formula tracking */
  tracking?: number[];
  /** Visible columns on the viewport */
  visibleRows?: number[];
  /** Visible columns on the viewport */
  visibleCols?: number[];
  /** Viewport current width */
  width?: number;
  /** Viewport current width */
  height?: number;
  /** Get the row object */
  getRow: (row: number) => RowInstance;
  /** Internal worksheet onload method */
  onload?: () => void;
  /** Internal nested headers DOM container */
  nested?: object;
  /** Internal formula array values */
  resetArray?: (x: number, y: number) => void;
  /** Freeze a number of rows */
  setFreezeRows: (numberOfRows: number) => void;
  /** Reset the freeze rows */
  resetFreezeRows: () => void;
  /** Reset the properties of a cell */
  resetProperty: (x: number, y: number) => void;
  /** Internal method */
  setFormula: () => void;
  /** Update nested cell properties */
  setNestedCell: (x: number, y: number, properties: Nested) => void;
  /** Internal method: Update the merge cell dimensions */
  updateMerge: (cellName: string, colspan: number, rowspan: number) => void;
  /** Get the worksheet name */
  getWorksheetName: () => string;
  /** Rename an existing worksheet by its position */
  renameWorksheet: (position: number, title: string) => void;
  /** Open this worksheet */
  openWorksheet: () => void;
  /** Move the position of a worksheet. DOM Only (Internal method) - Please use updateWorksheet */
  moveWorksheet: (from: number, to: number) => void;
  /** Get the worksheet index by instance or worksheet instance by index */
  getWorksheet: (worksheetIdent: worksheetInstance | number) => number | string;
  /** Get the active worksheet when applicable */
  getWorksheetActive: () => number;
  /** Delete an existing worksheet by its position */
  deleteWorksheet: (position: number) => void;
  /** Get a validation object. Require the extension Validations. */
  getValidations: (validationIndex: number | null) => Validation | Validation[];
  /** Insert or update existing validations by index. Require the extension Validations. */
  setValidations: (validations: Validations[]) => void;
  /** Reset validations by validation indexes. Require the extension Validations. */
  resetValidations: (validationIndex: number | number[]) => void;
  /** Resize columns to match the visible content */
  autoWidth: (columns: number[]) => void;
}
