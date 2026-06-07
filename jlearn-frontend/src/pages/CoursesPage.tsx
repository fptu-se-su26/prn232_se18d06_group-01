import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Course {
  courseId: number;
  name: string;
  description: string;
  level?: string;
  imageUrl?: string;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data.data?.items || response.data.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 text-lg font-semibold bg-red-100 p-4 rounded-lg shadow-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
            Explore Courses
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Find the perfect Japanese course to enhance your skills and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.courseId} to={`/courses/${course.courseId}`} className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                <div className="h-48 bg-indigo-100 dark:bg-indigo-900 relative overflow-hidden flex-shrink-0">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-300 dark:text-indigo-500">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide shadow-sm">
                    {course.level || 'Beginner'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                    {course.description}
                  </p>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-auto">
                    View Course Details
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {courses.length === 0 && !loading && !error && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
