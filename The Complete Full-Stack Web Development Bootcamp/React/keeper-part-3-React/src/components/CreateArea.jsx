import React, { useState } from "react";

function CreateArea(props) {
  const [draft, setDraft] = useState({
    title: "",
    content: "",
  });

  function handleDraft(event) {
    const { name, value } = event.target;
    setDraft((prevDraft) => {
      return {
        ...prevDraft,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onAdd(draft);
    setDraft({
      title: "",
      content: "",
    });
    console.log("datos enviados");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={draft.title}
          onChange={handleDraft}
          required
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          value={draft.content}
          onChange={handleDraft}
          rows="3"
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
