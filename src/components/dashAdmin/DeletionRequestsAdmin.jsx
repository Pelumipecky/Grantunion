import React, { useState } from 'react';
import { supabaseDb } from "../../database/supabaseUtils";
import Modal from "../Modal";

const DeletionRequestsAdmin = ({ deletionRequests = [], currentUser, setDeletionRequests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const showModal = (type, title, message, onConfirm = null) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabaseDb.approveDeletionRequest(
        selectedRequest.id,
        currentUser.id,
        adminNotes.trim()
      );

      if (error) {
        console.error('Error approving deletion request:', error);
        showModal('error', 'Error', 'Failed to approve deletion request. Please try again.');
      } else {
        showModal('success', 'Success', `User ${selectedRequest.user_name} has been successfully deleted.`);
        // Refresh the list
        const { data: updatedRequests } = await supabaseDb.getDeletionRequests();
        setDeletionRequests(updatedRequests || []);
        setSelectedRequest(null);
        setAdminNotes('');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Error approving deletion request:', error);
      showModal('error', 'Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabaseDb.rejectDeletionRequest(
        selectedRequest.id,
        currentUser.id,
        adminNotes.trim()
      );

      if (error) {
        console.error('Error rejecting deletion request:', error);
        showModal('error', 'Error', 'Failed to reject deletion request. Please try again.');
      } else {
        showModal('success', 'Success', `Deletion request for ${selectedRequest.user_name} has been rejected.`);
        // Refresh the list
        const { data: updatedRequests } = await supabaseDb.getDeletionRequests();
        setDeletionRequests(updatedRequests || []);
        setSelectedRequest(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Error rejecting deletion request:', error);
      showModal('error', 'Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingRequests = deletionRequests.filter(req => req.status === 'pending');
  const processedRequests = deletionRequests.filter(req => req.status !== 'pending');

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#FFB347', marginBottom: '1rem' }}>Account Deletion Requests</h2>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--dark-clr3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 179, 71, 0.2)' }}>
            <h3 style={{ color: '#FFB347', margin: '0 0 0.5rem 0' }}>Pending Requests</h3>
            <p style={{ color: 'var(--text-clr1)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{pendingRequests.length}</p>
          </div>
          <div style={{ background: 'var(--dark-clr3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 179, 71, 0.2)' }}>
            <h3 style={{ color: '#FFB347', margin: '0 0 0.5rem 0' }}>Total Requests</h3>
            <p style={{ color: 'var(--text-clr1)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{deletionRequests.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: '#FFB347', marginBottom: '1rem' }}>Pending Approval</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingRequests.map((request) => (
              <div key={request.id} style={{
                background: 'var(--dark-clr2)',
                border: '1px solid rgba(255, 179, 71, 0.3)',
                borderRadius: '15px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-clr1)', margin: '0 0 0.5rem 0' }}>{request.user_name}</h4>
                    <p style={{ color: 'var(--text-deco)', margin: '0 0 0.5rem 0' }}>{request.email}</p>
                    <p style={{ color: 'var(--text-clr1)', margin: 0 }}>
                      <strong>Requested:</strong> {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    background: '#FFB347',
                    color: '#1C0F36',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    PENDING
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--text-clr1)', margin: '0 0 0.5rem 0' }}>
                    <strong>Reason:</strong>
                  </p>
                  <p style={{ color: 'var(--text-deco)', margin: 0, fontStyle: 'italic' }}>
                    &ldquo;{request.reason}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setAdminNotes('');
                      showModal('confirm', 'Approve Deletion Request',
                        `Are you sure you want to approve the deletion request for ${request.user_name}? This will permanently delete their account and all associated data.`,
                        handleApproveRequest
                      );
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <i className="icofont-check" style={{ marginRight: '0.25rem' }}></i>
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setAdminNotes('');
                      showModal('confirm', 'Reject Deletion Request',
                        `Are you sure you want to reject the deletion request for ${request.user_name}?`,
                        handleRejectRequest
                      );
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <i className="icofont-close" style={{ marginRight: '0.25rem' }}></i>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 style={{ color: '#FFB347', marginBottom: '1rem' }}>Processed Requests</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {processedRequests.map((request) => (
              <div key={request.id} style={{
                background: 'var(--dark-clr3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                opacity: 0.7
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-clr1)', margin: '0 0 0.5rem 0' }}>{request.user_name}</h4>
                    <p style={{ color: 'var(--text-deco)', margin: '0 0 0.5rem 0' }}>{request.email}</p>
                    <p style={{ color: 'var(--text-clr1)', margin: 0 }}>
                      <strong>Processed:</strong> {new Date(request.reviewed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    background: request.status === 'approved' ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {request.status.toUpperCase()}
                  </div>
                </div>

                {request.admin_notes && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-clr1)', margin: '0 0 0.5rem 0' }}>
                      <strong>Admin Notes:</strong>
                    </p>
                    <p style={{ color: 'var(--text-deco)', margin: 0, fontStyle: 'italic' }}>
                      &ldquo;{request.admin_notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {deletionRequests.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-deco)'
        }}>
          <i className="icofont-exclamation-tringle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
          <p>No deletion requests found.</p>
        </div>
      )}

      {/* Modal for admin notes */}
      {selectedRequest && modalConfig.type === 'confirm' && (
        <Modal
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          title={modalConfig.title}
        >
          <div>
            <p style={{ color: 'var(--text-clr1)', marginBottom: '1rem' }}>{modalConfig.message}</p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--text-clr1)', display: 'block', marginBottom: '0.5rem' }}>
                Admin Notes (optional):
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this decision..."
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid var(--opac-clr3)',
                  borderRadius: '8px',
                  background: 'var(--dark-clr4)',
                  color: 'var(--text-clr1)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                disabled={isProcessing}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={closeModal}
                disabled={isProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  border: '1px solid var(--text-deco)',
                  background: 'transparent',
                  color: 'var(--text-clr1)',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={modalConfig.onConfirm}
                disabled={isProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: modalConfig.title.includes('Approve') ?
                    'linear-gradient(135deg, #4CAF50, #45a049)' :
                    'linear-gradient(135deg, #f44336, #d32f2f)',
                  color: 'white',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {isProcessing ? 'Processing...' : (modalConfig.title.includes('Approve') ? 'Approve' : 'Reject')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalConfig.isOpen && modalConfig.type !== 'confirm'}
        onClose={closeModal}
        title={modalConfig.title}
      >
        <div>
          <p style={{ color: 'var(--text-clr1)', marginBottom: '1rem' }}>{modalConfig.message}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={closeModal}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                border: 'none',
                background: 'linear-gradient(135deg, #FFB347, #FF7A18)',
                color: '#1C0F36',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeletionRequestsAdmin;