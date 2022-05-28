import React from "react";
import Note from "./Note/Note";

const Notes = ({ notes }) => {
  return (
    <div>
      {notes.map((e, i) => (
        <Note key={i} note={e} />
      ))}
    </div>
  );
};

export default Notes;
