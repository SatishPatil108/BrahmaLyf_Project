// src/pages/CourseDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const courses = [
  {
    id: '1',
    title: 'Unlock Your Mind',
    description: 'A 30-day journey to expand your mental clarity and focus.',
    image: 'https://placehold.co/600x360',
    details: 'This course will help you improve your mental clarity through daily exercises...',
  },
  {
    id: '2',
    title: 'Mastering Productivity',
    description: 'Learn time-blocking, deep work, and habit systems.',
    image: 'https://placehold.co/600x360',
    details: 'Discover the secrets of managing your time and increasing focus...',
  },
  {
    id: '3',
    title: 'Healing & Energy',
    description: 'Tap into powerful inner healing through breath and stillness.',
    image: 'https://placehold.co/600x360',
    details: 'Learn techniques for energy healing and mindfulness...',
  },
];

function CourseDetail() {
  const { id } = useParams();
  const course = courses.find(course => course.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Link to="/courses" className="text-purple-600 hover:underline">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{course.title}</h1>
      <img src={course.image} alt={course.title} className="rounded mb-6 w-full" />
      <p className="text-gray-700 mb-6">{course.details}</p>
      <Link to="/courses" className="text-purple-600 hover:underline">
        &larr; Back to Courses
      </Link>
    </div>
  );
}

export default CourseDetail;
