import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

interface Lesson {
  lessonId: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
}

const AdminLessonsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(0);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${courseId}/lessons`);
      setLessons(response.data.data?.items || response.data.data || []);
    } catch (error) {
      console.error('Error fetching lessons', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const openModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setTitle(lesson.title);
      setDescription(lesson.description);
      setOrderIndex(lesson.orderIndex);
    } else {
      setEditingLesson(null);
      setTitle('');
      setDescription('');
      setOrderIndex(lessons.length > 0 ? Math.max(...lessons.map(l => l.orderIndex)) + 1 : 0);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, description, orderIndex: Number(orderIndex), courseId: Number(courseId) };
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.lessonId}`, payload);
      } else {
        await api.post('/lessons', payload);
      }
      closeModal();
      fetchLessons();
    } catch (error) {
      alert('Error saving lesson');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await api.delete(`/lessons/${id}`);
        fetchLessons();
      } catch (error) {
        alert('Error deleting lesson');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/courses" className="text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Manage Lessons for Course #{courseId}</h2>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Lesson
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {lessons.map((lesson) => (
                <tr key={lesson.lessonId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{lesson.orderIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{lesson.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-500 truncate max-w-md">{lesson.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openModal(lesson)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(lesson.lessonId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No lessons found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4" id="modal-title">
                    {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Lesson Title</label>
                      <input 
                        type="text" 
                        required 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea 
                        required 
                        rows={3} 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Order Index</label>
                      <input 
                        type="number" 
                        required
                        value={orderIndex} 
                        onChange={e => setOrderIndex(Number(e.target.value))}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Save
                  </button>
                  <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessonsPage;
