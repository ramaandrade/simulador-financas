// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const useSettings = () => {
    const initialSettings = {
        marmitaria_1: true, marmitaria_2: true, marmitaria_3: true, marmitaria_4: true, marmitaria_5: true, marmitaria_6: true, marmitaria_7: true,
        padaria_1: true, padaria_2: true, padaria_3: true, padaria_4: true, padaria_5: true, padaria_6: true, padaria_7: true,
        moda_1: true, moda_2: true, moda_3: true, moda_4: true, moda_5: true, moda_6: true, moda_7: true,
        consultoria_marmitaria_1: false, consultoria_marmitaria_2: false, consultoria_marmitaria_3: false, consultoria_marmitaria_4: false, consultoria_marmitaria_5: false, consultoria_marmitaria_6: false, consultoria_marmitaria_7: false,
        consultoria_padaria_1: false, consultoria_padaria_2: false, consultoria_padaria_3: false, consultoria_padaria_4: false, consultoria_padaria_5: false, consultoria_padaria_6: false, consultoria_padaria_7: false,
        consultoria_moda_1: false, consultoria_moda_2: false, consultoria_moda_3: false, consultoria_moda_4: false, consultoria_moda_5: false, consultoria_moda_6: false, consultoria_moda_7: false,
        consultoria_desafios: false,
    };
    
    const [settings, setSettings] = useState(initialSettings);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'globals', 'settings'), (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    return settings;
};
