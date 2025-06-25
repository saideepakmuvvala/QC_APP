import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DevQCEntriesList = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dev');
                setEntries(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEntries();
    }, []);

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            fontSize: '28px',
            marginBottom: '20px',
            color: '#333',
        },
        list: {
            listStyleType: 'none',
            padding: '0',
            margin: '0',
        },
        entryCard: {
            backgroundColor: '#f9f9f9',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        entryTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
        },
        entryText: {
            fontSize: '16px',
            color: '#555',
            margin: '5px 0',
        },
        screenshot: {
            marginTop: '15px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
        },
        screenshotHover: {
            transform: 'scale(1.1)',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Dev Entries</h2>
            <ul style={styles.list}>
                {entries.map((entry) => (
                    <li key={entry._id} style={styles.entryCard}>
                        <p style={styles.entryTitle}>{entry.name}</p>
                        <p style={styles.entryText}>
                            <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <p style={styles.entryText}>
                            <strong>Number of Buildings:</strong> {entry.numberOfBuildings}
                        </p>
                        {entry.screenshot && (
                            <img
                                src={`http://localhost:5000/${entry.screenshot}`}
                                alt="Screenshot"
                                width="200"
                                style={styles.screenshot}
                                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DevQCEntriesList;
