import React, { useState } from 'react';
import axios from 'axios';

const AddEntryForm = ({ onEntryAdded }) => {
    const [date, setDate] = useState('');
    const [name, setName] = useState(''); // State for the selected username
    const [numberOfBuildings, setNumberOfBuildings] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [error, setError] = useState('');
    const [screenshotPreview, setScreenshotPreview] = useState(null);

    // Static list of usernames
    const usernames = [
        "User1",
        "User2",
        "User3",
        "User4",
        "User5"
    ];

    const captureScreenshot = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' },
            });
    
            const video = document.createElement('video');
            video.srcObject = stream;
            document.body.appendChild(video); // Optional: For debugging purposes
            video.style.display = "none";
    
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve();
                };
            });
    
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            stream.getTracks().forEach((track) => track.stop());
    
            canvas.toBlob((blob) => {
                const file = new File([blob], `screenshot-${Date.now()}.png`, {
                    type: 'image/png',
                });
                setScreenshot(file);
                setScreenshotPreview(URL.createObjectURL(blob));
            });
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            setError('Failed to capture screenshot. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state before submitting

        if (!screenshot) {
            setError('Please capture a screenshot before submitting.');
            return;
        }

        if (!name) {
            setError('Please select a username.');
            return;
        }

        const formData = new FormData();
        formData.append('date', date);
        formData.append('name', name);
        formData.append('numberOfBuildings', numberOfBuildings);
        formData.append('screenshot', screenshot);

        try {
            await axios.post('http://localhost:5000/api/qc', formData);
            onEntryAdded();
            setDate('');
            setName('');
            setNumberOfBuildings('');
            setScreenshot(null);
            setScreenshotPreview(null);
        } catch (error) {
            setError('Error adding entry. Please try again.');
        }
    };

    const styles = {
        formContainer: {
            maxWidth: '600px',
            margin: '30px auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '36px', // Larger font size for the title
            color: '#333',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#555',
        },
        formInput: {
            width: '100%',
            padding: '12px 15px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s ease',
        },
        selectInput: {
            width: '100%',
            padding: '12px 15px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
            outline: 'none',
        },
        submitButton: {
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        errorMessage: {
            color: 'red',
            fontSize: '14px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        captureButton: {
            padding: '12px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        previewImage: {
            maxWidth: '100%',
            height: 'auto',
            marginTop: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
        },
    };

    return (
        <div>
            <h1 style={styles.header}>QC Application</h1>
            <div style={styles.formContainer}>
                <h2 style={styles.header}>Add New Entry</h2>
                {error && <div style={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            style={styles.formInput}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username:</label>
                        <select
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={styles.selectInput}
                        >
                            <option value="">Select a user</option>
                            {usernames.map((username) => (
                                <option key={username} value={username}>
                                    {username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Number of Buildings:</label>
                        <input
                            type="number"
                            value={numberOfBuildings}
                            onChange={(e) => setNumberOfBuildings(e.target.value)}
                            required
                            style={styles.formInput}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Screenshot:</label>
                        <button
                            type="button"
                            onClick={captureScreenshot}
                            style={styles.captureButton}
                        >
                            Capture Screenshot
                        </button>
                        {screenshotPreview && (
                            <img
                                src={screenshotPreview}
                                alt="Screenshot Preview"
                                style={styles.previewImage}
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        style={styles.submitButton}
                    >
                        Add Entry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntryForm;
