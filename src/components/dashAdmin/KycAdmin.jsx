import React, { useEffect, useState } from 'react';
import { supabaseDb } from '../../database/supabaseUtils';
import { supabase } from '../../database/supabaseConfig';

export default function KycAdmin({ currentUser }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch initial KYC requests
    const fetchKycRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('kyc')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching KYC requests:', error);
          return;
        }
        
        if (data) {
          setRequests(data);
        }
      } catch (err) {
        console.error('Failed to fetch KYC requests:', err);
      }
    };

    fetchKycRequests();

    // Set up real-time subscription
    const subscription = supabase
      .channel('kyc-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc'
      }, (payload) => {
        fetchKycRequests(); // Refresh data on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateKyc = async (kycId, newStatus) => {
    try {
      console.log(`📋 Calling KYC update API for ${kycId} -> ${newStatus}`);
      
      // Call server-side API endpoint to update KYC and send email
      const response = await fetch('/api/admin/kyc/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycId, newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ KYC update failed:', result);
        alert(`Failed to ${newStatus.toLowerCase()} KYC. Please try again.`);
        return;
      }

      console.log('✅ KYC updated:', result.message);
      alert(`✅ KYC ${newStatus.toLowerCase()} successfully!`);
      
      // Refresh KYC requests list
      const { data, error } = await supabase
        .from('kyc')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setRequests(data);
      }
    } catch (err) {
      console.error('KYC update error', err);
      alert(`Failed to ${newStatus.toLowerCase()} KYC. Please try again.`);
    }
  };

  return (
    <div className="investmentMainCntn">
      <div className="overviewSection">
        <h2>KYC Requests ({requests.length})</h2>
      </div>

      <div className="myinvestmentSection">
        {requests.length === 0 ? (
          <div className="emptyTable">
            <i className="icofont-exclamation-tringle"></i>
            <p>No KYC requests.</p>
          </div>
        ) : (
          <div className="kycTableContainer">
            <table className="kycTable">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>ID Type</th>
                  <th>ID Number</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{idx + 1}</td>
                    <td>{r.user_name || 'N/A'}</td>
                    <td className="cryptic-id">{r.user_id ? r.user_id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td>{r.id_type || 'N/A'}</td>
                    <td className="id-number">
                      {r.status === 'Verified' ? (r.id_number || 'N/A') : '••••••••'}
                    </td>
                    <td>
                      <span className={`kyc-status ${r.status?.toLowerCase() || 'submitted'}`}>
                        {r.status === 'pending' || !r.status ? 'Submitted' : r.status}
                      </span>
                    </td>
                    <td>{(() => {
                      const d = new Date(r.created_at || r.submitted_at || 0);
                      return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                    })()}</td>
                    <td>
                      <div className="action-buttons">
                        {r.status !== 'Verified' && (
                          <button
                            className="action-btn verify"
                            onClick={() => updateKyc(r.id, 'Verified')}
                          >
                            Verify
                          </button>
                        )}
                        {r.status !== 'Rejected' && (
                          <button
                            className="action-btn reject"
                            onClick={() => updateKyc(r.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
