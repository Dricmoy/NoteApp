'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Nav from '@/components/nav';
import CreateCourse from '@/components/createCourse';
import FeatureSection from '@/components/landing_featured';
import LoadingScreen from '@/components/Loading';
import { SanityClient } from '@sanity/client'; // Add your sanity client import

interface Course {
  _id: string; // Sanity document ID
  courseName: string;
  instructor: string;
  semester: string;
  department: string;
  year: number;
}

const proxyUrl = "http://localhost:3001/proxy"; // URL to your proxy server

const CoursePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Course[]>([]);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const pathArray = window.location.pathname.split('/');
    const uidFromPath = pathArray[pathArray.length - 1];
    setUid(uidFromPath);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // GROQ query to fetch courses based on the university ID
        const query = `
          *[_type == "course" && university._ref == "${uid}"] {
            _id,
            courseName,
            instructor,
            semester,
            department,
            year
          }
        `;
        const response = await fetch(`${proxyUrl}?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setClasses(data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    if (uid) {
      fetchCourses();
    }
  }, [uid]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const placeholderDescription = 'This is a placeholder description for the course.';
  const placeholderSemester = 'Select a Semester';
  const placeholderDepartment = 'Select a Department';

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredClasses = classes.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSemester ? course.semester.includes(selectedSemester) : true) &&
    (selectedDepartment ? course.department.includes(selectedDepartment) : true)
  );

  return (
    <>
      <Nav page_name='university' />
      <div className="p-4 min-h-screen bg-white">
        {/* Centered search bar */}
        <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="custom-select flex items-center">
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="p-2 border-1 border-gray-300 shadow-lg focus:outline-double focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{placeholderSemester}</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((course, index) => (
            <Link href={`/university/${uid}/course/${course._id}`} key={index}>
              <Card className="flex flex-col items-start bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 overflow-hidden shadow-md transition-transform transform hover:scale-105 w-full rounded-md">
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{course.courseName}</div>
                  <div className="text-gray-600 dark:text-gray-400">{placeholderDescription}</div>
                  <div className="text-xs mt-auto text-gray-500 dark:text-gray-300">{course.semester} - {course.department}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <CreateCourse uid={uid} />
      </div>
    </>
  );
};

export default CoursePage;
