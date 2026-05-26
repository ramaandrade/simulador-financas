// src/utils/db.js
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';
const SETTINGS_DOC = 'globals/settings';
const LOGS_COLLECTION = 'access_logs';

// Admin Default Settings
const initialSettings = {
  marmitaria_1: true, marmitaria_2: true, marmitaria_3: true, marmitaria_4: true, marmitaria_5: true, marmitaria_6: true, marmitaria_7: true,
  padaria_1: true, padaria_2: true, padaria_3: true, padaria_4: true, padaria_5: true, padaria_6: true, padaria_7: true,
  moda_1: true, moda_2: true, moda_3: true, moda_4: true, moda_5: true, moda_6: true, moda_7: true,
  consultoria_marmitaria: false,
  consultoria_padaria: false,
  consultoria_moda: false,
  consultoria_desafios: false,
};

const adminProfile = {
  id: 'admin_1',
  name: 'Prof. Lucas Rama',
  email: 'rama.lucas@urca.br',
  password: '430798@R',
  role: 'admin'
};

// Auto-inject admin if missing
export const initDB = async () => {
    try {
        const adminRef = doc(db, USERS_COLLECTION, 'admin_1');
        await setDoc(adminRef, adminProfile, { merge: true });

        const settingsRef = doc(db, 'globals', 'settings');
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
            await setDoc(settingsRef, initialSettings);
        }
    } catch (e) {
        console.error("Erro inicializando DB", e);
    }
};

export const getUsers = async () => {
  await initDB();
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map(doc => doc.data());
};

export const getUserByEmail = async (email) => {
  await initDB();
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

export const registerAlumn = async (email, password = '123456') => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('E-mail já está em uso.');
  }

  const name = email.split('@')[0];
  const newId = `alumn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const newUser = {
    id: newId,
    name,
    email: email.toLowerCase().trim(),
    password: password,
    role: 'alumn',
    isBlocked: true
  };

  await setDoc(doc(db, USERS_COLLECTION, newId), newUser);
  return newUser;
};

export const batchRegisterAlumns = async (emailsString, defaultPassword = '123456') => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emailsMatches = emailsString.match(emailRegex) || [];
  const uniqueEmailsToProcess = [...new Set(emailsMatches.map(e => e.toLowerCase().trim()))];

  const batch = writeBatch(db);
  let addedCount = 0;

  for (const email of uniqueEmailsToProcess) {
    const existing = await getUserByEmail(email);
    if (!existing) {
      const newId = `alumn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newUserRef = doc(db, USERS_COLLECTION, newId);
      batch.set(newUserRef, {
        id: newId,
        name: email.split('@')[0],
        email: email,
        password: defaultPassword,
        role: 'alumn',
        isBlocked: true
      });
      addedCount++;
    }
  }

  if (addedCount > 0) {
    await batch.commit();
  }
  return addedCount;
};

export const updateAllAlumnsPassword = async (newPassword) => {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    if (data.role === 'alumn') {
       batch.update(docSnap.ref, { password: newPassword });
    }
  });

  await batch.commit();
};

export const updateAlumn = async (oldEmail, newEmail, newName) => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', oldEmail.toLowerCase()));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    if (newEmail !== oldEmail) {
        const checkNew = await getUserByEmail(newEmail);
        if (checkNew) throw new Error('O novo e-mail já existe na base.');
    }
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, { email: newEmail.toLowerCase().trim(), name: newName });
    return true;
  }
  return false;
};

export const updateAlumnPassword = async (email, newPassword) => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, { password: newPassword });
    return true;
  }
  return false;
};

export const toggleAlumnBlock = async (email, isBlocked) => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, { isBlocked: isBlocked });
    return true;
  }
  return false;
};

export const setAllAlumnsBlockStatus = async (isBlocked) => {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    if (data.role === 'alumn') {
       batch.update(docSnap.ref, { isBlocked: isBlocked });
    }
  });

  await batch.commit();
};

export const logAccess = async (email) => {
  try {
    const now = new Date();
    // YYYY-MM-DD local
    const dateString = now.toLocaleDateString('pt-BR').split('/').reverse().join('-'); 
    const timeString = now.toLocaleTimeString('pt-BR');
    
    const newId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const logDoc = {
       id: newId,
       email,
       timestamp: now.getTime(),
       dateString,
       timeString
    };
    await setDoc(doc(db, LOGS_COLLECTION, newId), logDoc);
  } catch(e) {
    console.error("Erro ao registrar log de acesso", e);
  }
};

export const getAccessLogs = async (filterDateString) => {
  // filterDateString in YYYY-MM-DD
  const logsRef = collection(db, LOGS_COLLECTION);
  let q;
  if (filterDateString) {
     q = query(logsRef, where('dateString', '==', filterDateString));
  } else {
     q = query(logsRef);
  }
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => doc.data());
  // Sort descending by timestamp
  return results.sort((a, b) => b.timestamp - a.timestamp);
};

export const deleteUser = async (email) => {
    if (email === 'rama.lucas@urca.br') return; // protect admin
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
       await deleteDoc(snapshot.docs[0].ref);
    }
};

export const getSettings = async () => {
   await initDB();
   const settingsRef = doc(db, 'globals', 'settings');
   const snap = await getDoc(settingsRef);
   return snap.exists() ? snap.data() : {};
};

export const updateSettings = async (newSettingsObj) => {
   const settingsRef = doc(db, 'globals', 'settings');
   await setDoc(settingsRef, newSettingsObj, { merge: true });
};
