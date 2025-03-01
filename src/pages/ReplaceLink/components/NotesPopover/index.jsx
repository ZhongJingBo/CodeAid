import React, { useState, useEffect } from "react";
import { Input, Button, Popover, message, Radio } from "antd";
import { DownOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.less";

const NotesPopover = ({ paramKey, paramValue, onValueChange }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const domain = window.location.hostname;

  // 加载笔记数据
  useEffect(() => {
    loadNotes();
  }, [domain, paramKey]);

  // 从 localStorage 加载笔记
  const loadNotes = () => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem("paramNotes") || "{}");
      const domainNotes = savedNotes[domain]?.[paramKey] || [];
      setNotes(domainNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
      message.error("Failed to load notes");
    }
  };

  // 保存笔记
  const handleSaveNote = () => {
    if (!currentNote.trim()) {
      message.warning("Please enter a note");
      return;
    }

    try {
      const savedNotes = JSON.parse(localStorage.getItem("paramNotes") || "{}");
      const newNote = {
        content: currentNote,
        createdAt: new Date().toISOString(),
        key: paramKey,
        value: paramValue,
      };

      // 更新数据结构
      savedNotes[domain] = {
        ...savedNotes[domain],
        [paramKey]: [...(savedNotes[domain]?.[paramKey] || []), newNote],
      };
   
      localStorage.setItem("paramNotes", JSON.stringify(savedNotes));
      setNotes(savedNotes[domain][paramKey]);
      setCurrentNote("");
      setShowNoteInput(false);
      message.success("Note saved successfully");
    } catch (error) {
      console.error("Failed to save note:", error);
      message.error("Failed to save note");
    }
  };

  // 处理替换值
  const handleReplaceValue = () => {
    if (selectedNoteIndex === null) {
      message.warning("Please select a note first");
      return;
    }

    const selectedNote = notes[selectedNoteIndex];
    onValueChange(selectedNote.value);  // 调用父组件传入的方法更新值
    message.success("Value replaced successfully");
    setShowSavedNotes(false)
  };

  // 删除笔记
  const handleDeleteNote = (index) => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem("paramNotes") || "{}");
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      
      if (updatedNotes.length === 0) {
        // 如果没有笔记了，删除整个 paramKey
        delete savedNotes[domain][paramKey];
      } else {
        savedNotes[domain][paramKey] = updatedNotes;
      }
      
      localStorage.setItem("paramNotes", JSON.stringify(savedNotes));
      setNotes(updatedNotes);
      
      if (selectedNoteIndex === index) {
        setSelectedNoteIndex(null);
      }
      
      message.success("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      message.error("Failed to delete note");
    }
  };

  // 笔记输入表单
  const noteContent = (
    <div className="notes-editor">
      <div className="param-info">
        <div className="info-item">
          <span className="label">Key:</span>
          <span className="value">{paramKey}</span>
        </div>
        <div className="info-item">
          <span className="label">Value:</span>
          <span className="value">{paramValue}</span>
        </div>
      </div>

      <div className="notes-input">
        <span className="label">Notes:</span>
        <div className="textarea-wrapper">
          <Input
            placeholder="Add your notes here..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={4}
            style={{ minWidth: "250px" }}
          />
        <div className="button-wrapper">
          <Button type="primary" onClick={handleSaveNote}>
            Save
          </Button>
        </div>
        </div>
   
      </div>
    </div>
  );

  // 已保存的笔记列表
  const savedNotesContent = (
    <div className="saved-notes-content">
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note-item">
            <div className="note-left">
              <Radio
                checked={selectedNoteIndex === index}
                onChange={() => setSelectedNoteIndex(index)}
              />
              <div className="note-key">
                <span className="note-content">{note.content}:</span>
                <span className="note-value">{paramKey}= {note.value}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={() => handleDeleteNote(index)}
              />
            </div>
          </div>
        ))}
        {notes.length > 0 && (
          <div className="notes-footer">
            <Button type="primary" size="small" onClick={handleReplaceValue}>
              Replace Value
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="notes-container">
      <div className="notes-actions">
        <Popover
          content={noteContent}
          title="Add Note"
          trigger="click"
          placement="bottomRight"
          open={showNoteInput}
          onOpenChange={setShowNoteInput}
        >
          <Button size="small" className="add-param-btn">
            Add
          </Button>
        </Popover>
        {notes.length > 0 && (
          <Popover
            content={savedNotesContent}
            title="Saved Notes"
            trigger="click"
            placement="bottomRight"
            open={showSavedNotes}
            onOpenChange={(visible) => {
              setShowSavedNotes(visible);
            }}
          >
            <Button
              type="text"
              size="small"
              className="show-note-btn"
              icon={<DownOutlined />}
            />
          </Popover>
        )}
      </div>
    </div>
  );
};

export default NotesPopover;
