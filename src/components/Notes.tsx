import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, PenTool, Clock, Tag, X, Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    tags: [],
    timestamp: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('debate-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('debate-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      timestamp: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!currentNote.title || !currentNote.content) return;

    const noteIndex = notes.findIndex(note => note.id === currentNote.id);
    
    if (noteIndex >= 0) {
      // Update existing note
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = { 
        ...currentNote,
        timestamp: new Date().toISOString() 
      };
      setNotes(updatedNotes);
    } else {
      // Add new note
      setNotes(prev => [
        { 
          ...currentNote,
          timestamp: new Date().toISOString() 
        }, 
        ...prev
      ]);
    }
    
    setIsEditing(false);
    setCurrentNote({
      id: '',
      title: '',
      content: '',
      tags: [],
      timestamp: ''
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    if (currentNote.id === id) {
      setIsEditing(false);
      setCurrentNote({
        id: '',
        title: '',
        content: '',
        tags: [],
        timestamp: ''
      });
    }
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const addTag = () => {
    if (!currentTag.trim() || currentNote.tags.includes(currentTag)) return;
    
    setCurrentNote({
      ...currentNote,
      tags: [...currentNote.tags, currentTag.trim()]
    });
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="pt-16 pb-6"> {/* Add top padding to account for navbar */}
      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center">
            <PenTool className="mr-2" size={20} />
            Debate Notes
          </h3>
        </div>

        <div className="mb-6">
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNewNote}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Create New Note
            </motion.button>
          )}
        </div>

        {isEditing ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Note Title"
              value={currentNote.title}
              onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="w-full mb-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Your notes here..."
              value={currentNote.content}
              onChange={e => setCurrentNote({ ...currentNote, content: e.target.value })}
              className="w-full h-32 mb-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            
            <div className="flex flex-wrap items-center mb-2">
              <Tag size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              
              {currentNote.tags.map(tag => (
                <span 
                  key={tag} 
                  className="mr-2 mb-1 px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)} 
                    className="ml-1 text-purple-800 dark:text-purple-200 hover:text-purple-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
              
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  className="w-24 px-2 py-1 text-xs rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={addTag}
                  className="px-2 py-1 text-xs rounded-r-md bg-purple-500 text-white"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveNote}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center"
                disabled={!currentNote.title || !currentNote.content}
              >
                <Save size={16} className="mr-2" />
                Save Note
              </motion.button>
            </div>
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map(note => (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 border-l-4 border-purple-500"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white">{note.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editNote(note)}
                      className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {note.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatDate(note.timestamp)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No notes yet. Create your first note to keep track of important debate points.
          </div>
        )}
      </div>
    </div>
  );
}