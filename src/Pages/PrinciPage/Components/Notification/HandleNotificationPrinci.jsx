import React, { useState } from 'react';
import StaffNotificationPrinci from './StaffNotificationPrinci';
import CreateStaffNotification from './CreateStaffNotification';
import CreateSTDNotification from './CreateSTDNotification';
import DeleteSTDNoti from './DeleteSTDNoti';

function HandleNotificationPrinci() {
  const [activeTab, setActiveTab] = useState('staff'); // State to track the selected tab

  return (
    <div className=''>
      {/* Tab Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        marginTop:'40px'
      }}>
        <button
          onClick={() => setActiveTab('staff')}
          style={{
            padding: '10px 25px',
            margin: '0 10px',
            backgroundColor: activeTab === 'staff' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'staff' ? '#fff' : '#000',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: activeTab === 'staff' ? 'bold' : 'normal',
          }}
        >
          Staff
        </button>
        <button
          onClick={() => setActiveTab('student')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: activeTab === 'student' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'student' ? '#fff' : '#000',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: activeTab === 'student' ? 'bold' : 'normal',
          }}
        >
          Student
        </button>
      </div>

      {/* Display Components Based on Selected Tab */}
      {activeTab === 'staff' && (
        <div>
          {/* Staff Components */}
          <CreateStaffNotification />
          <StaffNotificationPrinci />

        </div>
      )}
      {activeTab === 'student' && (
        <div>
          {/* Student Components */}
          <CreateSTDNotification />
          <DeleteSTDNoti />
        </div>
      )}
    </div>
  );
}

export default HandleNotificationPrinci;
