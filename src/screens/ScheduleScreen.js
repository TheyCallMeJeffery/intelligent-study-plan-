import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

const ScheduleScreen = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate(); 
  const [schedule, setSchedule] = useState([]);
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [extracurricularHours, setExtracurricularHours] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null); 
  const [currentTime, setCurrentTime] = useState(new Date()); 
  const [reminderMessage, setReminderMessage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [shownReminders, setShownReminders] = useState([]); 

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'; 

  
  const localAudioUrl = "/assets/music/reminder.mp3";  

  
  const refreshToken = async () => {
    try {
      const response = await axios.post(`${backendURL}/api/token/refresh/`, {
        refresh: state?.refreshToken,
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data.access;
    } catch (error) {
      console.error('Failed to refresh token', error);
      alert('Your session has expired. Please log in again.');
      navigate('/login'); 
      return null;
    }
  };

  
  useEffect(() => {
    if (state?.token) {
      axios
        .get(`${backendURL}/api/schedule/`, {
          headers: { Authorization: `Bearer ${state.token}` }, 
        })
        .then((response) => {
          setSchedule(response.data);
        })
        .catch(async (error) => {
          console.error('Failed to fetch schedule:', error);

          
          if (error.response && error.response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              
              axios
                .get(`${backendURL}/api/schedule/`, {
                  headers: { Authorization: `Bearer ${newToken}` },
                })
                .then((response) => {
                  setSchedule(response.data);
                })
                .catch((error) => {
                  console.error('Failed to fetch schedule after token refresh:', error);
                  alert('Failed to fetch schedule. Please try again later.');
                });
            }
          } else {
            alert('Failed to fetch schedule. Please try again later.');
          }
        });
    }
  }, [state?.token, state?.refreshToken, backendURL]);

  
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date()); 
    }, 1000);

    return () => clearInterval(clockInterval); 
  }, []);

  
  useEffect(() => {
    
    const currentFormattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    console.log("Current Time:", currentFormattedTime); 

   
    schedule.forEach(item => {
      const scheduleFormattedTime = item.time.slice(0, 5); 
      console.log("Scheduled Time:", scheduleFormattedTime); 
    });

    
    const upcomingEvent = schedule.find(item => item.time.slice(0, 5) === currentFormattedTime);

    if (upcomingEvent && !shownReminders.includes(upcomingEvent.id)) {
      console.log('Reminder triggered for:', upcomingEvent.subject); 
      setReminderMessage(`Time to study ${upcomingEvent.subject}!`);
      setIsModalOpen(true); 
      setShownReminders(prev => [...prev, upcomingEvent.id]); 

      
      const audio = new Audio(localAudioUrl);
      audio.play();
    } else {
      console.log("No reminder triggered at this time."); 
    }
  }, [currentTime, schedule, shownReminders]);

  
  const handlePredict = () => {
    axios
      .post(
        `${backendURL}/api/predict/`,
        {
          extracurricular_hours: extracurricularHours,
          sleep_hours: sleepHours,
          stress_level: stressLevel,
        },
        {
          headers: { Authorization: `Bearer ${state?.token}` }, 
        }
      )
      .then((response) => {
        setPrediction(response.data.predicted_study_hours);
      })
      .catch((error) => {
        console.error('Prediction error:', error);
        alert('Failed to get prediction');
      });
  };

  
  const handleAddSchedule = () => {
    if (subject && time) {
      axios
        .post(
          `${backendURL}/api/schedule/`,
          {
            subject: subject,
            time: time,
          },
          {
            headers: { Authorization: `Bearer ${state?.token}` },
          }
        )
        .then((response) => {
          setSchedule((prevSchedule) => [...prevSchedule, response.data]);
          setSubject('');
          setTime('');
        })
        .catch((error) => {
          console.error('Error adding schedule:', error.response || error);
          alert('Failed to add schedule.');
        });
    } else {
      alert('Please fill out both subject and time fields.');
    }
  };

  
  const handleEditSchedule = () => {
    if (subject && time && editingScheduleId) {
      axios
        .put(
          `${backendURL}/api/schedule/`,
          {
            id: editingScheduleId,
            subject: subject,
            time: time,
          },
          {
            headers: { Authorization: `Bearer ${state?.token}` },
          }
        )
        .then((response) => {
          
          const updatedSchedule = schedule.map((item) =>
            item.id === editingScheduleId ? response.data : item
          );
          setSchedule(updatedSchedule);
          setSubject('');
          setTime('');
          setEditingScheduleId(null); 
        })
        .catch((error) => {
          console.error('Error editing schedule:', error.response || error);
          alert('Failed to edit schedule.');
        });
    } else {
      alert('Please fill out both subject and time fields.');
    }
  };

  
  const handleDeleteSchedule = (scheduleId) => {
    axios
      .delete(
        `${backendURL}/api/schedule/`,
        {
          data: { id: scheduleId },
          headers: { Authorization: `Bearer ${state?.token}` },
        }
      )
      .then(() => {
        setSchedule(schedule.filter((item) => item.id !== scheduleId)); 
      })
      .catch((error) => {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule.');
      });
  };

  
  const handleEditClick = (schedule) => {
    setSubject(schedule.subject);
    setTime(schedule.time);
    setEditingScheduleId(schedule.id); 
  };

  
  const cancelEdit = () => {
    setSubject('');
    setTime('');
    setEditingScheduleId(null);
  };

 
  const handleLogout = () => {
    navigate('/login'); 
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Your Study Schedule:</h2>
      {schedule.length > 0 ? (
        schedule.map((item, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <p>{item.subject} at {item.time}</p>
            <button onClick={() => handleEditClick(item)} style={{ marginRight: 10 }}>Edit</button>
            <button onClick={() => handleDeleteSchedule(item.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
          </div>
        ))
      ) : (
        <p>No schedules available</p>
      )}

      <h1>{editingScheduleId ? 'Edit Schedule' : 'Add a New Schedule'}</h1>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <input
        type="time"
        placeholder="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      {editingScheduleId ? (
        <>
          <button onClick={handleEditSchedule} style={{ marginRight: 10 }}>Save Changes</button>
          <button onClick={cancelEdit} style={{ backgroundColor: 'gray', color: 'white' }}>Cancel</button>
        </>
      ) : (
        <button onClick={handleAddSchedule}>Add Schedule</button>
      )}

      <h1>Predict Study Hours</h1>
      <input
        type="number"
        placeholder="Extracurricular Hours"
        value={extracurricularHours}
        onChange={(e) => setExtracurricularHours(e.target.value)}
        style={{ marginBottom: 10, padding: 8 }}
      />
      <input
        type="number"
        placeholder="Sleep Hours"
        value={sleepHours}
        onChange={(e) => setSleepHours(e.target.value)}
        style={{ marginBottom: 10, padding: 8 }}
      />
      <input
        type="number"
        placeholder="Stress Level"
        value={stressLevel}
        onChange={(e) => setStressLevel(e.target.value)}
        style={{ marginBottom: 10, padding: 8 }}
      />
      <button onClick={handlePredict} style={{ padding: 10, backgroundColor: 'green', color: 'white' }}>
        Predict
      </button>

      {prediction !== null && (
        <h2>Predicted Study Hours: {prediction.toFixed(2)}</h2>
      )}

      {reminderMessage && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <strong>{reminderMessage}</strong>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={handleLogout} style={{ padding: 10, backgroundColor: 'blue', color: 'white' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ScheduleScreen;
