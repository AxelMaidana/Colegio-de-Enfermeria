import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function HeaderContent() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUserData(userDoc.data());
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const loginModal = document.getElementById('login-modal');
    loginModal?.classList.remove('hidden');
  };

  const handleRegister = () => {
    const registerModal = document.getElementById('register-modal');
    registerModal?.classList.remove('hidden');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return (
      <nav>
        <div id="auth-buttons" className="space-x-4">
          <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Iniciar Sesión</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Registrarse</button>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <div id="user-info" className="flex items-center space-x-4">
        <span id="welcome-message">Bienvenido, {userData?.name || user.displayName}</span>
        <a href="/perfil" className="hover:text-gray-300">Perfil</a>
        {userData?.role === 'admin' && (
          <a href="/admin/dashboard" className="hover:text-gray-300">Dashboard</a>
        )}
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Cerrar Sesión</button>
      </div>
    </nav>
  );
}