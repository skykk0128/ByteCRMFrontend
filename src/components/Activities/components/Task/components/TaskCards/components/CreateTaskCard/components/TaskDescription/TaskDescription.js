import React from 'react';
import EditableText from '../../../../../../../../../Style/EditableText';
import "./TaskDescription.scss"

const TaskDescription = ({
  cardId,
  description,
  handleUpdate,
}) => {
  return(
    <div className="taskDescription">        
          <EditableText 
            content={description}
            onContentChange={(description)=>handleUpdate(description,"description")}
            placeholder = {"Add description"}
          />
    </div>
  )    
}


export default TaskDescription;