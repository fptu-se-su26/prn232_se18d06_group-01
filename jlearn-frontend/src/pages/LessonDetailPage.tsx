import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  vocabularyCount?: number;
  grammarCount?: number;
  questionCount?: number;
  orderIndex?: number;
}

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Course ID
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/courses/${id}/lessons`);
        const data = response.data.data || [];
        setLessons(data);
        if (data.length > 0) {
          setSelectedLesson(data[0]); // Select first lesson by default
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Sidebar for Lessons List */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-4 transition-colors">
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Lessons</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lessons.length} lessons available</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {lessons.map((lesson, index) => (
              <li key={lesson.lessonId}>
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left px-6 py-4 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:bg-indigo-50 dark:focus:bg-gray-700 ${
                    selectedLesson?.lessonId === lesson.lessonId ? 'bg-indigo-50 dark:bg-gray-700 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${selectedLesson?.lessonId === lesson.lessonId ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-300'}`}>
                      {index + 1}. {lesson.title}
                    </span>
                    <div className="flex gap-2">
                      {lesson.vocabularyCount !== undefined && <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.vocabularyCount} Vocab</span>}
                      {lesson.questionCount !== undefined && <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.questionCount} Quiz</span>}
                    </div>
                  </div>
                </button>
              </li>
            ))}
            {lessons.length === 0 && (
              <li className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                No lessons found for this course.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 h-screen">
        {selectedLesson ? (
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {selectedLesson.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="mr-1.5 w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ready to learn
                  </span>
                </div>
              </div>
              <div className="p-8 prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 min-h-[400px]">
                {selectedLesson.description ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedLesson.description }} />
                ) : (
                  <div className="space-y-6">
                    <p className="text-lg">Welcome to <strong>{selectedLesson.title}</strong>! In this lesson, we will explore key concepts.</p>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                      <h3 className="text-indigo-800 dark:text-indigo-300 font-bold mt-0 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Key Takeaways
                      </h3>
                      <ul className="text-indigo-700 dark:text-indigo-400 mb-0 mt-4 space-y-2">
                        <li className="flex items-start"><span className="mr-2">•</span> Understand the core principles</li>
                        <li className="flex items-start"><span className="mr-2">•</span> Practice with interactive examples</li>
                        <li className="flex items-start"><span className="mr-2">•</span> Review and quiz yourself</li>
                      </ul>
                    </div>
                    <p className="text-gray-500 italic text-sm mt-8">Note: Detailed lesson content will be available soon.</p>
                  </div>
                )}
              </div>
              <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <button className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
                  Previous
                </button>
                <button className="px-5 py-2.5 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm flex items-center">
                  Complete & Next
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Select a Lesson</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Choose a lesson from the sidebar to start learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetailPage;
