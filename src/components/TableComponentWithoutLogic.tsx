import React, { useState, useCallback } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaAngleDown, FaX } from "react-icons/fa6";
import useFetch from '../hooks/useFetchHook';
import { tableDataType } from '../../types';

const ROWS_PER_PAGE = 12;

export default function OptimizedTableComponent() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(page);
  const [selectedData, setSelectedData] = useState<Record<number, tableDataType[]>>({});
  const [overlay, setOverlay] = useState(false);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const columns = [
    { field: 'title', header: 'Title' },
    { field: 'place_of_origin', header: 'Origin' },
    { field: 'artist_display', header: 'Artist' },
    { field: 'inscriptions', header: 'Inscriptions' },
    { field: 'date_start', header: 'Start Date' },
    { field: 'date_end', header: 'End Date' }
  ];

  const onSelectionChange = useCallback((e: { value: tableDataType[] }) => {
    setSelectedData(prev => ({ ...prev, [page]: e.value }));
  }, [page]);

  const onPageChange = useCallback((e: DataTableStateEvent) => {
    if (typeof e.page === 'number') {
      setPage(e.page + 1);
    }
  }, []);

  const fetchData = useCallback(async (pageNum: number): Promise<tableDataType[]> => {
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum}`);
      const result = await response.json();
      return result.data.map((row: tableDataType) => ({
        title: row.title,
        place_of_origin: row.place_of_origin,
        artist_display: row.artist_display,
        inscriptions: row.inscriptions,
        date_start: row.date_start,
        date_end: row.date_end,
      }));
    } catch (error) {
      console.error("Error fetching data", error);
      return [];
    }
  }, []);

  const selectRowsAcrossPages = useCallback(async (numRows: number) => {
    setIsSelecting(true);
    let remainingRows = numRows;
    let currentPage = page;
    const newSelectedData: Record<number, tableDataType[]> = {};

    while (remainingRows > 0) {
      const pageData = await fetchData(currentPage);
      const rowsToSelectOnPage = Math.min(remainingRows, pageData.length);
      newSelectedData[currentPage] = pageData.slice(0, rowsToSelectOnPage);
      remainingRows -= rowsToSelectOnPage;
      currentPage++;
    }

    setSelectedData(prev => ({ ...prev, ...newSelectedData }));
    setIsSelecting(false);
  }, [page, fetchData]);

  const onSubmitRows = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOverlay(false);
    selectRowsAcrossPages(rowsToSelect);
  }, [rowsToSelect, selectRowsAcrossPages]);

  const headerTemplate = useCallback(() => (
    <div className="relative">
      <div className='flex items-center'>
        <span>Title</span>
        <FaAngleDown onClick={() => setOverlay(true)} className="ml-2 cursor-pointer" />
      </div>
      {overlay && (
        <form className='flex flex-col gap-2 p-4 rounded-lg shadow-xl absolute z-50 bg-white text-sm' onSubmit={onSubmitRows}>
          <FaX className='h-4 w-4 absolute top-3 right-3 bg-red-400 p-1 text-white cursor-pointer' onClick={() => setOverlay(false)}/>
          <label htmlFor="rows">Select Rows</label>
          <input 
            type="number" 
            className='p-2 border border-cyan-400 outline-none rounded-lg' 
            value={rowsToSelect} 
            onChange={(e) => setRowsToSelect(Number(e.target.value))}
            disabled={isSelecting}
          />
          <button disabled={isSelecting} className='bg-cyan-500 hover:bg-cyan-600 rounded-lg p-2 text-white' type='submit'>Submit</button>
        </form>
      )}
    </div>
  ), [overlay, rowsToSelect, isSelecting, onSubmitRows]);

  const selectedRows = selectedData[page] || [];

  return (
    <div className="card">
      {error && <h4 className='text-red-500 text-lg text-center my-6'>Some Error Occurred, Please Try Again Later.</h4>}
      <DataTable 
        value={data} 
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        loading={loading}
        lazy
        paginator 
        rows={ROWS_PER_PAGE}
        totalRecords={126079}
        first={(page - 1) * ROWS_PER_PAGE}
        onPage={onPageChange}
        tableStyle={{ minWidth: '50rem' }}
        showGridlines
        selectionMode={"radiobutton"}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        {columns.map((col, index) => (
          <Column key={col.field} field={col.field} header={index === 0 ? headerTemplate() : col.header} />
        ))}
      </DataTable>
    </div>
  );
}