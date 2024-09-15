
import { useState, useEffect, useCallback } from 'react';

import { tableDataType } from '../../types';

import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaAngleDown, FaX } from "react-icons/fa6";

import useFetch from '../hooks/useFetchHook';

const ROWS_PER_PAGE = 12;

export default function TableComponent() {

    // states to track page, data and selected data
    const [page,setPage] = useState(1);
    const { data, loading, error } = useFetch(page);
    const [selectedData,setSelectedData] = useState<Record<number, tableDataType[]>>({});

    // state to toggle overlay
    const [overlay,setOverlay] = useState(false);

    // state to track overlay selected rows
    const [rowsToSelect,setRowsToSelect] = useState<number>(0);
    const [remainingRows, setRemainingRows] = useState<number>(0); 
    const [initialPage, setInitialPage] = useState<number>(0);

    const selectedRows = selectedData[page] || [];

    const columns = [
        {field: 'title', header: 'Title', headerBody:'sdad'},
        {field: 'place_of_origin', header: 'Origin'},
        {field: 'artist_display', header: 'Artist'},
        {field: 'inscriptions', header: 'Inscriptions'},
        {field: 'date_start', header: 'Start Date'},
        {field: 'date_end', header: 'End Date'}
    ];

    const onSelectionChange = useCallback((e: { value: tableDataType[] }) => {
      setSelectedData((prev)=>({
          ...prev,
          [page]: e.value
        }));
    },[page]);

    const onPageChange = useCallback((e:DataTableStateEvent) => {
        if(typeof(e.page)==='number'){
            setPage(e.page+1);
        }
    },[]);
    
    useEffect(() => {
       
        if (!loading && remainingRows > 0 && page > initialPage && (page-initialPage)*ROWS_PER_PAGE <= rowsToSelect) {

            console.log("Select karo")
            const remainingRowsToSelect = Math.max(remainingRows - data.length, 0);
            const rowsOnCurrentPage = Math.min(data.length, remainingRows);

            // Select rows on the current page
            selectRowsOnCurrentPage(rowsOnCurrentPage);

            // If there are still rows to select, update rowsToSelect
            setRemainingRows(remainingRowsToSelect);
        }
    }, [loading]);


    const selectRowsOnCurrentPage = useCallback((numRows: number) => {
        const rowsToSelect = Math.min(numRows, data?.length || 0);
        const selected = data?.slice(0, rowsToSelect) || [];

        setSelectedData(prev => ({
        ...prev,
        [page]: selected
        }));

        setRemainingRows(prev => prev - rowsToSelect);
    }, [data, page]);
    
    const onSubmitRows = useCallback((event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const numRows = Number(rowsToSelect)
        setRemainingRows(numRows);
        setInitialPage(page);       
        selectRowsOnCurrentPage(numRows);
        setOverlay(false);
    },[rowsToSelect,page,selectRowsOnCurrentPage]);

    const headerTemplate = useCallback(() => (
        <div className="relative">
          <div className='flex items-center'>
            <span>Title</span>
            <FaAngleDown onClick={() => setOverlay(true)} className="ml-2 cursor-pointer" />
          </div>
          {overlay && (
            <form className='flex flex-col gap-2 p-4 rounded-lg shadow-xl absolute z-50 bg-white text-sm' onSubmit={onSubmitRows}>
              <FaX className='h-4 w-4 absolute top-3 right-3 bg-red-400 p-1 text-white cursor-pointer' onClick={() => setOverlay(false)} />
              <label htmlFor="rows">Select Rows</label>
              <input 
                type="number" 
                className='p-2 border border-cyan-400 outline-none rounded-lg' 
                value={rowsToSelect} 
                onChange={(e) => setRowsToSelect(Number(e.target.value))}
              />
              <button className='bg-cyan-500 hover:bg-cyan-600 rounded-lg p-2 text-white' type='submit'>Submit</button>
            </form>
          )}
        </div>
    ), [overlay, rowsToSelect, onSubmitRows]);


    return (
    <div className="card">
      {error && <h4 className='text-red-500 text-lg text-center my-6'>An error occurred. Please try again later.</h4>}
      <DataTable 
        value={data || []}
        selection={selectedRows || []}
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
        selectionMode="multiple"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        {columns.map((col, index) => (
          <Column key={col.field} field={col.field} header={index === 0 ? headerTemplate() : col.header} />
        ))}
      </DataTable>
    </div>
    );
}
        