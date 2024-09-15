
import { useState } from "react"
import TableComponent from "../components/TableComponent"
import TableComponentWithoutLogic from "../components/TableComponentWithoutLogic"

const Home = () => {

  const [current,setCurrent] = useState(0);

  return (
    <div className="min-h-screen w-full bg-gray-200">

      <div className="rounded-xl bg-blue-500 flex items-center gap-3 p-3 text-white font-semibold mb-2">
        <button className={`p-2 rounded-xl ${current===0?'bg-cyan-400':''}`} onClick={()=>setCurrent(0)}>Table Component 1</button>
        <button className={`p-2 rounded-xl ${current===1?'bg-cyan-400':''}`} onClick={()=>setCurrent(1)}>Table Component 2</button>
      </div>

        {current === 0 && <TableComponent/>}
        {current === 1 && <TableComponentWithoutLogic/>}
    </div>
  )
}

export default Home