import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 1,
    title: 'Unlock Your Mind',
    description: 'A 30-day journey to expand your mental clarity and focus.',
    image: 'https://images.pexels.com/photos/935756/pexels-photo-935756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400',
  },
  {
    id: 2,
    title: 'Mastering Productivity',
    description: 'Learn time-blocking, deep work, and habit systems.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Healing & Energy',
    description: 'Tap into powerful inner healing through breath and stillness.',
    image: 'https://images.pexels.com/photos/4054241/pexels-photo-4054241.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400',
  },
];

function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-6 py-16 text-white">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-white drop-shadow-lg">
        Transformative Courses
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-800 rounded-xl shadow-xl hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1 duration-300"
          >
            <img
              src={course.image}
              alt={course.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x200?text=Image+Unavailable';
              }}
              className="rounded-t-xl w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-white">{course.title}</h3>
              <p className="text-gray-300 mt-3">{course.description}</p>
              <Link
                to={`/courses/${course.id}`}
                className="inline-block mt-6 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center bg-purple-900 py-16 px-8 rounded-xl shadow-inner max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Life?</h3>
        <p className="text-purple-200 mb-6">
          Start your personal growth journey with expert guidance and powerful tools.
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}

export default Courses;
