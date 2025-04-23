import React from 'react';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { username } = useParams();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-gray-600">@username</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="font-bold">Posts</p>
              <p>0</p>
            </div>
            <div className="text-center">
              <p className="font-bold">Abonnés</p>
              <p>0</p>
            </div>
            <div className="text-center">
              <p className="font-bold">Abonnements</p>
              <p>0</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Posts récents</h2>
          <div className="space-y-4">
            {/* Les posts seront affichés ici */}
            <p className="text-gray-500 text-center">Aucun post pour le moment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 