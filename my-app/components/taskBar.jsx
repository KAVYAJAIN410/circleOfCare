import React from "react";

const TaskBar=({children})=>{
return(
    <div className="p-2 flex justify-between m-2" style={{borderRadius:"10px",backgroundColor:"#F0E2C6"}}>
     <p>{children}</p>
     <input type="checkbox"></input>
    </div>
)
}
export default TaskBar;