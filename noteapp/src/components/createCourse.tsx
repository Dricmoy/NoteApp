'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from './ui/button';

interface CreateCourseProps {
  uid: string;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ uid }) => {
  const [courseName, setCourseName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('https://pdfstoragefunctionapp.azurewebsites.net/api/createCourse?code=kahFRRqGm546CL3_jg_oZN_gVIqZlUg_8SWj7XGBRCouAzFuoagPug%3D%3D', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          courseName: courseName,
          professorName: professorName,
          semester: semester,
          year: year,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/university/${uid}/course/${data.cid}`);
      } else {
        console.error('Failed to create course:', response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setCourseName('');
    setProfessorName('');
    setSemester('');
    setYear('');
  };

  const getLastTwentyYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());
  };

  return (
    <div>
      <Button
        variant="default"
        onClick={openModal}
        className="bg-blue-600 hover:bg-blue-700 text-white my-4 transition-all duration-300 ease-in-out"
      >
        Create Course
      </Button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative transform transition-all duration-300 scale-95 hover:scale-100">
            <Button
              variant="default"
              className="absolute top-4 right-4 bg-white border text-black hover:text-gray-200 transition"
              onClick={closeModal}
            >
              &times;
            </Button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add a Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name:
                </label>
                <input
                  type="text"
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                  placeholder="BIO 102"
                  className="block w-full rounded-lg p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="professorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Professor Name:
                </label>
                <input
                  type="text"
                  id="professorName"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  required
                  placeholder="John A. Smith"
                  className="block w-full rounded-lg p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
              <div className="mb-5 relative">
        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
            Semester:
        </label>
        <div className="relative">
            <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
            className="block w-full rounded-lg p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
            <option value="" disabled>
                Select Semester
            </option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
                />
            </svg>
            </span>
        </div>
        </div>
        <div className="mb-5 relative">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Year:
        </label>
        <div className="relative">
            <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="block w-full rounded-lg p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
            <option value="" disabled>
                Select Year
            </option>
            {getLastTwentyYears().map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                {yearOption}
                </option>
            ))}
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
                />
            </svg>
            </span>
        </div>
        </div>

              <Button
                type="submit"
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-all duration-300"
              >
                Create Course
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
