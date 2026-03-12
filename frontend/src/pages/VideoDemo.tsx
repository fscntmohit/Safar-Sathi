import React from 'react';
import { VideoPlayer } from '../components/VideoPlayer';

export const VideoDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Video Player Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Video</h2>
          <VideoPlayer 
            src="/1757015121725861.mp4"
            className="max-w-2xl mx-auto"
            controls={true}
            autoPlay={false}
            muted={true}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Video Information</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>File:</strong> 1757015121725861.mp4</p>
            <p><strong>Size:</strong> 138MB</p>
            <p><strong>Format:</strong> MP4</p>
            <p><strong>Location:</strong> /public/1757015121725861.mp4</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure the video file is in the public folder</li>
              <li>• Check that the video format is supported by your browser</li>
              <li>• Try refreshing the page if the video doesn't load</li>
              <li>• Check browser console for any error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
