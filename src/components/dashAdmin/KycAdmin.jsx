import React, { useEffect, useState } from 'react';
import { supabaseDb } from '../../database/supabaseUtils';
import { supabase } from '../../database/supabaseConfig';
import { sendTransactionalEmail } from '../../lib/emailService';

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
      // First get the KYC record
      const { data: kycData, error: kycError } = await supabase
        .from('kyc')
        .select('*')
        .eq('id', kycId)
        .single();

      if (kycError || !kycData) throw new Error('KYC not found');

      // Update KYC status
      const { error: updateKycError } = await supabase
        .from('kyc')
        .update({
          status: newStatus
        })
        .eq('id', kycId);

      if (updateKycError) throw updateKycError;

      // Update user KYC status if userId exists
      if (kycData.user_id) {
        console.log('Updating user KYC status for user ID:', kycData.user_id, 'to status:', newStatus);
        const { error: updateUserError } = await supabase
          .from('userlogs')
          .update({
            kyc_status: newStatus
          })
          .eq('id', kycData.user_id);

        if (updateUserError) {
          console.error('Failed to update user KYC status:', updateUserError);
          throw updateUserError;
        }
        console.log('User KYC status updated successfully');

        // Create notification for user
        const notificationMessage = newStatus === 'Verified'
          ? '🎉 Congratulations! Your KYC verification has been approved. You can now make withdrawals and access all platform features.'
          : '❌ Your KYC verification has been rejected. Please check your submitted documents and try again, or contact support for assistance.';

        const notificationPush = {
          title: `KYC ${newStatus}`,
          message: notificationMessage,
          idnum: kycData.idnum,
          status: 'unseen',
          type: newStatus === 'Verified' ? 'success' : 'error'
        };

        const notificationResult = await supabaseDb.createNotification(notificationPush);
        if (notificationResult.error) {
          console.error('Notification creation error:', notificationResult.error);
          // Don't throw here - notification failure shouldn't block KYC update
        } else {
          console.log('KYC notification created successfully');
        }

        // Send email notification to user
        try {
          // Get user email from userlogs table
          const { data: userData, error: userError } = await supabase
            .from('userlogs')
            .select('email, name')
            .eq('idnum', kycData.idnum)
            .single();

          if (!userError && userData?.email) {
            const userName = userData.name || 'Valued User';
            const statusText = newStatus === 'Verified' ? 'APPROVED' : newStatus === 'Rejected' ? 'REJECTED' : newStatus;
            
            // Build HTML content for KYC email
            const htmlBody = newStatus === 'Verified' ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #2DC194; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .stats-box { background: #ffffff; border: 1px solid #e0e0e0; border-left: 4px solid #1C0F36; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-box { background: rgba(45, 193, 148, 0.1); border-left: 4px solid #2DC194; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #2DC194; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>KYC Verification Approved ✓</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Congratulations! Your KYC verification has been approved.</p>

      <div class="success-box">
        <strong>Verification Complete!</strong><br>
        Your account is now fully verified and you have access to all platform features:
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li style="padding: 5px 0;">✓ Full investment access</li>
          <li style="padding: 5px 0;">✓ Unlimited withdrawals</li>
          <li style="padding: 5px 0;">✓ Priority support</li>
          <li style="padding: 5px 0;">✓ Enhanced security</li>
        </ul>
      </div>

      <p>You can now:</p>
      <ul style="padding-left: 20px;">
        <li>Choose from our investment plans</li>
        <li>Make deposits and start earning</li>
        <li>Withdraw your funds anytime</li>
        <li>Access all premium features</li>
      </ul>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">Go to Dashboard</a>
      </p>

      <p>Thank you for completing the verification process.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #2DC194; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>` : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #FF9837; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .warning-box { background: rgba(255, 152, 55, 0.1); border-left: 4px solid #FF9837; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF9837; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>KYC Verification Update</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Your KYC verification status has been updated to: <strong style="color: #FF9837;">${statusText}</strong></p>

      <div class="warning-box">
        <strong>Next Steps:</strong><br>
        Please review your submitted documents and contact our support team if you need assistance or have questions about the decision.
      </div>

      <p>To resubmit your KYC application or get more information:</p>
      
      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard/kyc" class="button">KYC Dashboard</a>
      </p>

      <p>Our support team is here to help if you have any questions.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #FF9837; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

            const textBody = newStatus === 'Verified' ? `Dear ${userName},

Congratulations! Your KYC verification has been approved.

Your account is now fully verified and you have access to all platform features:
✓ Full investment access
✓ Unlimited withdrawals
✓ Priority support
✓ Enhanced security

You can now:
- Choose from our investment plans
- Make deposits and start earning
- Withdraw your funds anytime
- Access all premium features

Thank you for completing the verification process.

Best regards,
The Grant Union Investment Team` : `Dear ${userName},

Your KYC verification status has been updated to: ${statusText}

Please review your submitted documents and contact our support team if you need assistance or have questions about the decision.

Our support team is here to help if you have any questions.

Best regards,
The Grant Union Investment Team`;

            await sendTransactionalEmail({
              to: userData.email,
              subject: `KYC Verification ${statusText}`,
              htmlBody,
              textBody
            });

            console.log('✅ KYC email notification sent to:', userData.email);
          }
        } catch (emailError) {
          console.error('⚠️ Error sending KYC email notification:', emailError);
          // Don't throw here - email failure shouldn't block KYC update
        }
      }

      alert(`KYC ${newStatus.toLowerCase()} successfully!`);
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
