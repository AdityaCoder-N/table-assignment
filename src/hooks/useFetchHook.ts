import { useState,useEffect } from "react";
import {tableDataType} from "../../types.ts";


const useFetch = (page:number) => {

  const [data,setData] = useState<tableDataType[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>('');

  useEffect(()=>{

    const fetchData=async()=>{
        setLoading(true);
        try {
          // 
          const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
          const data = await response.json();
         
          const arr = data.data.map((row:tableDataType)=>{
              return ({
                  title:row.title,
                  place_of_origin:row.place_of_origin,
                  artist_display:row.artist_display,
                  inscriptions:row.inscriptions,
                  date_start:row.date_start,
                  date_end:row.date_end,
              })
          })
        
          setData(arr);
  
        } catch (error) {
          console.log("Error fetching data",error);
          setError("Error Fetching Data");
        } finally{
          setLoading(false);
        }
    }

    fetchData();

  },[page])


  return {data,loading,error};
}

export default useFetch
