import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Course {
  courseId: number;
  name: string;
  description: string;
  level?: string;
  imageUrl?: string;
}

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('N5');
  const [imageUrl, setImageUrl] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses?pageSize=50');
      setCourses(response.data.data?.items || response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setName(course.name);
      setDescription(course.description);
      setLevel(course.level || 'N5');
      setImageUrl(course.imageUrl || '');
    } else {
      setEditingCourse(null);
      setName('');
      setDescription('');
      setLevel('N5');
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, description, level, imageUrl };
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.courseId}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      closeModal();
      fetchCourses();
    } catch (error) {
      alert('Error saving course');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (error) {
        alert('Error deleting course');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Manage Courses</h2>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Course
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Course Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {courses.map((course) => (
                <tr key={course.courseId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{course.courseId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {course.imageUrl && (
                        <img src={course.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover mr-3 border border-slate-200" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-slate-900">{course.name}</div>
                        <div className="text-sm text-slate-500 truncate max-w-xs">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {course.level || 'Beginner'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/admin/courses/${course.courseId}/lessons`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Lessons
                    </Link>
                    <button 
                      onClick={() => openModal(course)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.courseId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No courses found. Create one to get started.
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
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Course Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)}
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
                      <label className="block text-sm font-medium text-slate-700">Level (e.g., N5, N4)</label>
                      <input 
                        type="text" 
                        value={level} 
                        onChange={e => setLevel(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Image URL</label>
                      <input 
                        type="url" 
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                        placeholder="https://example.com/image.jpg"
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

export default AdminCoursesPage;
