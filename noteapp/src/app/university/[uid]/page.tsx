'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Nav from '@/components/nav';
import CreateCourse from '@/components/createCourse';

interface Course {
  rowKey: string;
  courseName: string;
  instructor: string;
  semester: string;
  department: string;
  year: number;
}

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pdfstoragefunctionapp.azurewebsites.net/api/getClassesByUid?code=E9eyEuZNzKgqPruXoIuWOeUg7p9B4YyrAF2XNExxPGOxAzFujBjnPQ%3D%3D&uid=${encodeURIComponent(uid)}`);
        const data = await res.json();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setLoading(false);
      }
    };

    if (uid) {
      fetchData();
    }
  }, [uid]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const placeholderDescription = 'This is a placeholder description for the course.';
  const placeholderSemester = 'Select a Semester';
  const placeholderDepartment = 'Select a Department';

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredClasses = classes.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSemester ? course.semester.includes(selectedSemester) : true) &&
    (selectedDepartment ? course.department.includes(selectedDepartment) : true)
  );

  return (
    <>
      <Nav page_name='university' />
      <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.svg')" }}>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-40 mt-1 w-full rounded-md px-2 border-black border-2 shadow-sm focus:outline-none"
            />
          </div>
          <div className="custom-select flex items-center">
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="p-2 border-1 border-black shadow-lg ml-4 focus:outline-double dark:text-black"
            >
              <option value="">{placeholderSemester}</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-2 border-1 border-black shadow-lg ml-4 focus:outline-double dark:text-black"
            >
              <option value="">{placeholderDepartment}</option>
              <option value="CMPT">Computer Science</option>
              <option value="MATH">Mathematics</option>
              <option value="PHYS">Physics</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((course, index) => (
            <Link href={`/university/${uid}/course/${course.rowKey}`} key={index}>
              <Card className="flex flex-col items-start bg-neutral-800 dark:bg-zinc-800 hover:bg-primary overflow-hidden shadow-md transition-transform transform hover:scale-105 w-full">
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="text-lg text-white font-medium mb-2">{course.courseName}</div>
                  <div className="text-gray-600">{placeholderDescription}</div>
                  <div className="text-xs mt-auto text-gray-500">{course.semester} - {course.department}</div>
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
