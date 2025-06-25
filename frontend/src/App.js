import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes, not Switch
import AddEntryForm from './components/AddEntryForm';
import QCEntriesList from './components/QCEntriesList';
import DevQCEntriesList from './components/DevQCEntriesList';
import DevAddEntryForm from './components/DevAddEntryForm';

const App = () => {
    const [refresh, setRefresh] = useState(false);

    const handleEntryAdded = () => {
        setRefresh(!refresh);
    };

    return (
        <Router>
            <div>
                {/* Define the routes */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <AddEntryForm onEntryAdded={handleEntryAdded} />
                                <QCEntriesList key={refresh} />
                            </>
                        }
                    />
                    <Route
                        path="/dev"
                        element={
                            <>
                                <DevAddEntryForm onEntryAdded={handleEntryAdded} />
                                <DevQCEntriesList key={refresh} />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
