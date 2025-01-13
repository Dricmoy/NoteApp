'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Nav from '@/components/nav';
import LoadingScreen from '@/components/Loading';

interface University {
  uid: string;
  name: string;
  description: string;
}

const UniversityListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        // Fetch all universities from the backend (e.g., Sanity)
        const res = await fetch(`/api/universities`);
        const data = await res.json();
        setUniversities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Nav page_name="university" />
      <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.svg')" }}>
        <div className="text-xl mb-4">Universities</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((university, index) => (
            <Link href={`/university/${university.uid}`} key={index}>
              <Card className="flex flex-col items-start bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 overflow-hidden shadow-md transition-transform transform hover:scale-105 w-full rounded-md">
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{university.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{university.description}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default UniversityListPage;
