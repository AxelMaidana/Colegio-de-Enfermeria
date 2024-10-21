import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        if (data) {
          setUserData(data);
        }
      } else {
        window.location.href = '/noLoggedIn';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div id="admin-dashboard-loading">Loading...</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-bold pr-4">Nombre:</td>
            <td>{userData.name}</td>
          </tr>
          <tr>
            <td className="font-bold pr-4">Email:</td>
            <td>{userData.email}</td>
          </tr>
          <tr>
            <td className="font-bold pr-4">Fecha de nacimiento:</td>
            <td>{userData.birthday}</td>
          </tr>
          <tr>
            <td className="font-bold pr-4">Nombre de usuario:</td>
            <td>{userData.username}</td>
          </tr>
          <tr>
            <td className="font-bold pr-4">Rol:</td>
            <td>{userData.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}