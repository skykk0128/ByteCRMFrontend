import React from "react";
import NoteCard from '../NoteCard';
//import NoteModal from '../../../../../../../../Modal/components/Function/Note';
import CreateButton from '../../../../../../../../Style/Button/Activities/CreateButton';
//import Modal from '../../../../../../../../../js/Modal';
//import { ContactContext } from '../../../../../../../../../components/Contact/ContactContext';
import './NotesTimeLine.scss';

class NotesTimeLine extends React.Component {
  constructor () {
    super();
    this.state = {
      showModal: false,
      notes: [
        { id: 1, 
          author: "Joe Doe", 
          content: "test note render 1", 
          timestamp: "Aug 30, 2020 at 12:08 AM GMT+10",
          comments: [
            {id:123, author:"Joe", content: "comment test 1", timestamp:"Sep 14, 2020 at 12:08 AM GMT+10"}, 
            {id:124, author:"Chloe", content: "comment test 2", timestamp:"Sep 14, 2020 at 12:08 AM GMT+10"}
          ]
        },
        { id: 2, 
          author: "Jason Doe", 
          content: "test note render 2", 
          timestamp: "Aug 28, 2020 at 12:08 AM GMT+10",
          comments: [ {id:125, author:"Joe", content: "hello world"}]
        }
      ]
    };
  }
  

  getNotes() {    
    return this.state.notes.map((note) => { 
      return (
        <NoteCard 
          author={note.author} 
          content={note.content} 
          timestamp={note.timestamp}
          comments={note.comments}
          key={note.id} />
      ); 
    });
  }
  
  
    render(){
    const notes = this.getNotes();
    let noteNodes = <div>{notes}</div>;
    //const onClick= useContext(ContactContext); 
  
    
    return (
      <div className="timeline-container">
        <div className="timeline-action-container">
          <CreateButton className="timeline-action-button">Create Note</CreateButton>
        </div>
        <div className="timeline-all-notes">
          {noteNodes}
        </div>
      </div>
    );
  }
}

export default NotesTimeLine;