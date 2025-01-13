'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CreateFile from '@/components/createFile';
import Nav from '@/components/nav';
import LoadingScreen from '@/components/Loading';

interface FileData {
  _id: string;
  fileName: string;
  // Add other properties if needed
}

export default function Home() {
  const [cid, setCid] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    // Parse URL on the client side
    const pathArray = window.location.pathname.split('/');
    const cidFromPath = pathArray[pathArray.length - 1];
    const uidFromPath = pathArray[pathArray.length - 3];
    setUid(uidFromPath);
    setCid(cidFromPath);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Query to fetch files related to the cid
        const query = `*[_type == "file" && courseCid == $cid] {
          _id,
          fileName
        }`;

        // Send the query to your proxy server
        const res = await fetch(`http://localhost:3001/proxy?query=${encodeURIComponent(query)}&cid=${encodeURIComponent(cid)}`);
        const data = await res.json();
        
        if (res.ok) {
          setFiles(data.result); // Adjust depending on the structure of the response from your proxy
        } else {
          console.error('Error fetching data:', data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false); // Stop loading on error
      }
    };

    if (cid) {
      fetchData();
    }
  }, [cid]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Nav page_name="university" />
        <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.svg')" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Link href={`/university/${uid}/course/${cid}/file/${file._id}`} key={index}>
                <div className="flex flex-col items-start bg-neutral-800 dark:bg-zinc-800 hover:bg-primary overflow-hidden shadow-md transition-transform transform hover:scale-105 w-full p-4 rounded-md">
                  <div className="text-lg text-white font-medium mb-2">{file.fileName}</div>
                  {/* Add any additional file details here */}
                </div>
              </Link>
            ))}
          </div>

          <CreateFile cid={cid} uid={uid} />
        </div>

        <footer className="bg-secondary text-black py-6 dark:text-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p>&copy; 2024 NoteHub. All rights reserved.</p>
              <div className="space-x-4">
                <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
