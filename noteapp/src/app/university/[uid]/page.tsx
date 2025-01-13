'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Nav from '@/components/nav';
import LoadingScreen from '@/components/Loading';
import { StarIcon } from 'lucide-react';
import imageUrlBuilder from '@sanity/image-url'; // Import the image URL builder
import { createClient } from '@sanity/client'; // Ensure sanityClient is set up

const client = createClient({
    projectId: "qejur137", // Replace with your Sanity project ID
    dataset: "production", // Replace with your dataset
    apiVersion: "2023-01-01", // Use the latest API version
    useCdn: true,
});

interface FileData {
  _id: string;
  fileName: string;
  fileUrl: string;
  thumbnail: string;
}

interface Course {
    _id: string;
    name: string;
    cid: string;
    professorName: string;
    semester: string;
    year: string;
    university: {
        name: string;
    };
    image: {
        asset: {
            _ref: string; // Asset reference (e.g., "image-abc123")
        };
    };
}

// Sanity image URL builder function
const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).url(); // URL builder function

const CoursePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [uid, setUid] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const pathArray = window.location.pathname.split('/');
    const uidFromPath = pathArray[pathArray.length - 1];
    setUid(uidFromPath);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "course" && university._ref == "${uid}"] {
          _id,
          name,
          cid,
          professorName,
          semester,
          year,
          university->{name},
          image
        }`;

        const response = await fetch(`https://qejur137.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setCourses(data.result || []);
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

  const fetchFilesForCourse = async (courseCid: string) => {
    const query = `*[_type == "file" && courseCid == $cid] {
      _id,
      fileName,
      "fileUrl": file.asset->url,
      "thumbnail": thumbnail.asset->url
    }`;

    try {
      const res = await fetch(`https://qejur137.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(query)}&cid=${encodeURIComponent(courseCid)}`);
      const data = await res.json();
      setFiles(data.result || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    fetchFilesForCourse(course.cid);  // Fetch files for the selected course
    setShowModal(true);  // Show the modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setFiles([]);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Nav page_name="university" />
      <div className="p-6 min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
            {courses[0]?.university?.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Explore courses at {courses[0]?.university?.name} below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by course name, professor, or semester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Courses Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No courses found</div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course._id} onClick={() => handleCardClick(course)}>
                    <Card className="flex flex-col bg-white dark:bg-gray-700 dark:hover:bg-gray-700 overflow-hidden shadow-md transition-transform transform hover:scale-105 w-full rounded-md">
                        {/* Course Image */}
                        <div className="w-full h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                            <img
                            src={course.image ? urlFor(course.image) : '/placeholder.jpg'} // Fallback image
                            alt={course.name}
                            className="object-cover w-full h-full"  // Ensure image fills the container
                            />
                        </div>
                        <CardContent className="flex-1 p-4 flex flex-col space-y-4">
                        {/* Course Info */}
                        <div className="text-lg font-medium text-gray-900 dark:text-white">{course.name}</div>
                        <div className="text-gray-600 dark:text-gray-400">
                            {course.professorName} - {course.semester} {course.year}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{course.university.name}</div>

                        {/* Favorite Icon */}
                        <div className="flex justify-end mt-auto">
                            <StarIcon className="h-6 w-6 text-yellow-300 cursor-pointer hover:text-yellow-600" />
                        </div>
                        </CardContent>
                    </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for showing files */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Files for {selectedCourse.name}
            </h2>
            <div className="space-y-4">
              {files.length === 0 ? (
                <div>No files found for this course.</div>
              ) : (
                files.map((file) => (
                  <div key={file._id} className="flex items-center space-x-4">
                    <img src={file.thumbnail} alt={file.fileName} className="w-16 h-16 object-cover rounded-md" />
                    <a href={file.fileUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {file.fileName}
                    </a>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursePage;
