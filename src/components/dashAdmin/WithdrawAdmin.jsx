import React, { useState } from 'react';

const WithdrawAdmin = ({ withdrawals, activeUsers, setProfileState, setWithdrawData, onDataRefresh}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loadingId, setLoadingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Calculate withdrawal stats
    const withdrawalStats = {
        totalAmount: withdrawals.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        pendingAmount: withdrawals.filter(w => w.status === 'Pending')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        completedAmount: withdrawals.filter(w => w.status === 'Active')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        totalFees: withdrawals.reduce((sum, w) => sum + (parseFloat(w.withdrawal_fee) || 0), 0)
    };

    // Filter withdrawals
    const filteredWithdrawals = withdrawals.filter(withdrawal => {
        const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
        const matchesSearch = !searchTerm || 
            withdrawal.idnum.toString().includes(searchTerm) ||
            withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleApproveWithdrawal = async (withdrawal) => {
        setLoadingId(withdrawal.id);
        try {
            console.log('📝 Calling backend API to approve withdrawal:', withdrawal.id);

            // Call NEW backend API endpoint for approval
            const response = await fetch('/api/admin/withdrawals/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    withdrawalId: withdrawal.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to approve withdrawal');
            }

            if (result.alreadyProcessed) {
                alert('ℹ️ Withdrawal already processed\n\nThis withdrawal was already approved.');
            } else {
                alert(`✅ Withdrawal approved successfully!\n\nAmount: $${withdrawal.amount}\nMethod: ${withdrawal.paymentoption || 'N/A'}\n\nNotification and email sent to user.`);
            }
            
            // Refresh data without page reload
            if (onDataRefresh) {
                onDataRefresh();
            }
        } catch (error) {
            console.error("Error approving withdrawal:", error);
            alert('Failed to approve withdrawal: ' + error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleRejectWithdrawal = async (withdrawal) => {
        if (!window.confirm(`Reject this withdrawal of $${withdrawal.amount}? Amount will be refunded to user.`)) return;
        
        setLoadingId(withdrawal.id);
        try {
            // Call server-side API endpoint
            const response = await fetch('/api/withdrawals/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    withdrawalId: withdrawal.id,
                    withdrawal: withdrawal
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reject withdrawal');
            }

            alert('Withdrawal rejected and amount refunded!');
            // Withdrawal list will be refreshed by the parent component
        } catch (error) {
            console.error("Error rejecting withdrawal:", error);
            alert('Failed to reject withdrawal: ' + error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleCopyPaymentMethod = async (paymentMethod, withdrawalId) => {
        try {
            await navigator.clipboard.writeText(paymentMethod);
            setCopiedId(withdrawalId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    return (
    <div className="investmentMainCntn">
      <style>{`
        /* Withdrawal Table Container */
        .withdrawalTableContainer {
          width: 100%;
          border-radius: 12px;
          background-color: var(--dark-clr4);
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          scrollbar-width: thin;
          scrollbar-color: var(--sec-clr) var(--dark-clr3);
        }

        .withdrawalTableContainer::-webkit-scrollbar {
          height: 8px;
          background-color: var(--dark-clr3);
        }

        .withdrawalTableContainer::-webkit-scrollbar-track {
          background: var(--dark-clr3);
          border-radius: 10px;
        }

        .withdrawalTableContainer::-webkit-scrollbar-thumb {
          background: var(--sec-clr);
          border-radius: 10px;
        }

        .withdrawalTableContainer::-webkit-scrollbar-thumb:hover {
          background: #ff9b50;
        }

        /* Simplified Withdrawal List */
        .simplifiedWithdrawalsList {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .withdrawalListItem {
          background-color: var(--dark-clr4);
          border-radius: 10px;
          padding: 16px;
          border: 1px solid var(--opac-clr3);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .withdrawalListItem:hover {
          background-color: var(--dark-clr3);
          border-color: var(--sec-clr);
          box-shadow: 0 4px 12px rgba(255, 140, 55, 0.2);
          transform: translateX(4px);
        }

        .withdrawalItemContent {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 16px;
        }

        .withdrawalItemLeft {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .withdrawalAmount {
          font-size: 18px;
          font-weight: 700;
          color: var(--green-clr);
          text-align: left;
        }

        .withdrawalUserId {
          font-size: 13px;
          color: var(--text-deco);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
        }

        .withdrawalItemRight {
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
        }

        .clickIndicator {
          font-size: 20px;
          color: var(--sec-clr);
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        .withdrawalListItem:hover .clickIndicator {
          transform: translateX(4px);
        }

        .withdrawalTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          table-layout: auto;
          display: none;
        }

        .withdrawalTable thead {
          background: linear-gradient(135deg, var(--primary-clr), var(--sec-clr));
          color: white;
        }

        .withdrawalTable th {
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid var(--dark-clr2);
          position: sticky;
          top: 0;
          z-index: 10;
          white-space: nowrap;
        }

        .withdrawalTable th:first-child {
          border-top-left-radius: 12px;
          width: 50px;
          text-align: center;
          padding: 16px 8px;
        }

        .withdrawalTable th:nth-child(2) {
          width: 90px;
          padding: 16px 10px;
        }

        .withdrawalTable th:nth-child(3) {
          width: 110px;
          padding: 16px 10px;
        }

        .withdrawalTable th:nth-child(4) {
          width: 100px;
          padding: 16px 10px;
        }

        .withdrawalTable th:nth-child(5),
        .withdrawalTable th:nth-child(6) {
          width: 120px;
          padding: 16px 10px;
        }

        .withdrawalTable th:nth-child(7) {
          width: 95px;
          padding: 16px 10px;
        }

        .withdrawalTable th:nth-child(8) {
          width: 110px;
          padding: 16px 10px;
        }

        .withdrawalTable th:last-child {
          border-top-right-radius: 12px;
          width: 140px;
          text-align: center;
          padding: 16px 8px;
        }

        .withdrawalTable tbody tr {
          transition: all 0.2s ease;
          border-bottom: 1px solid var(--opac-clr3);
        }

        .withdrawalTable tbody tr:hover {
          background-color: var(--opac-clr2);
        }

        .withdrawalTable tbody tr:last-child {
          border-bottom: none;
        }

        .withdrawalTable td {
          padding: 14px 12px;
          vertical-align: middle;
          color: var(--text-clr1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }

        .withdrawalTable td:first-child {
          text-align: center;
          font-weight: 600;
          color: var(--sec-clr);
          width: 50px;
          padding: 14px 8px;
        }

        .withdrawalTable td:nth-child(2) {
          width: 90px;
          padding: 14px 10px;
        }

        .withdrawalTable td:nth-child(3) {
          width: 110px;
          padding: 14px 10px;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .withdrawalTable td:nth-child(4) {
          width: 100px;
          padding: 14px 10px;
        }

        .withdrawalTable td:nth-child(5),
        .withdrawalTable td:nth-child(6) {
          width: 120px;
          padding: 14px 10px;
        }

        .withdrawalTable td:nth-child(7) {
          width: 95px;
          padding: 14px 10px;
          text-align: center;
        }

        .withdrawalTable td:nth-child(8) {
          width: 110px;
          padding: 14px 10px;
          text-align: center;
        }

        .withdrawalTable td:nth-child(9) {
          width: 140px;
          padding: 14px 8px;
          text-align: center;
        }

        .withdrawalTable td:nth-child(8),
        .withdrawalTable td:nth-child(9) {
          text-align: center;
        }

        .historyTable {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .investmentTablehead {
          display: grid;
          gap: 12px;
          align-items: center;
          padding: 0 10px;
        }

        .investmentTablehead.header {
          background: linear-gradient(135deg, var(--primary-clr), var(--sec-clr));
          border-bottom: 2px solid var(--text-deco);
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 10px;
          min-width: 100%;
          color: white;
        }

        .unitheadsect {
          padding: 10px 8px;
          text-align: left;
          word-break: break-word;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 80px;
        }

        /* Desktop - show all 9 columns */
        @media (min-width: 1401px) {
          .investmentTablehead {
            grid-template-columns: repeat(9, 1fr);
            min-width: 1300px;
          }
        }

        /* Laptop - all columns with reduced spacing */
        @media (max-width: 1400px) and (min-width: 1025px) {
          .historyTable {
            overflow-x: auto;
          }
          .investmentTablehead {
            grid-template-columns: repeat(9, minmax(100px, 1fr));
            gap: 10px;
            padding: 8px;
            min-width: auto;
          }
          .unitheadsect {
            padding: 8px 6px;
            font-size: 0.95em;
            min-width: auto;
          }
        }

        /* Tablet landscape - all columns, compact */
        @media (max-width: 1024px) and (min-width: 768px) {
          .investmentTablehead {
            grid-template-columns: repeat(9, minmax(80px, 1fr));
            gap: 8px;
            padding: 6px;
            min-width: auto;
          }
          .unitheadsect {
            padding: 6px 4px;
            font-size: 0.9em;
            min-width: auto;
          }
          button {
            padding: 4px 8px !important;
            font-size: 0.8em !important;
          }
        }

        /* Tablet portrait - hide some columns */
        @media (max-width: 768px) and (min-width: 641px) {
          .historyTable {
            font-size: 0.85em;
            overflow-x: auto;
          }
          .investmentTablehead {
            grid-template-columns: repeat(7, minmax(70px, 1fr));
            gap: 6px;
            min-width: auto;
            padding: 6px;
          }
          .unitheadsect {
            padding: 5px 3px;
            font-size: 0.85em;
            min-width: auto;
          }
          .unitheadsect:nth-child(3),
          .unitheadsect:nth-child(12),
          .unitheadsect:nth-child(21),
          .unitheadsect:nth-child(30) {
            display: none;
          }
          button {
            padding: 3px 6px !important;
            font-size: 0.75em !important;
          }
        }

        /* Mobile - hide columns, show essential info */
        @media (max-width: 640px) {
          .historyTable {
            font-size: 0.8em;
            padding: 0;
            margin: 0 -16px;
            width: calc(100% + 32px);
          }
          .investmentTablehead {
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            padding: 8px 12px;
            min-width: 100%;
            border-bottom: 1px solid var(--text-deco);
          }
          .investmentTablehead.header {
            padding: 10px 12px;
            gap: 12px;
            font-weight: 600;
          }
          .unitheadsect {
            padding: 8px 0;
            min-width: auto;
            font-size: 0.9em;
          }
          /* Column layout: Amount | Status | Actions */
          .unitheadsect:nth-child(1),
          .unitheadsect:nth-child(2),
          .unitheadsect:nth-child(3),
          .unitheadsect:nth-child(4),
          .unitheadsect:nth-child(5),
          .unitheadsect:nth-child(6),
          .unitheadsect:nth-child(8) {
            display: none;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(1) {
            display: flex;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(2) {
            display: flex;
            font-weight: 600;
            min-width: 70px;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(7) {
            display: flex;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(9) {
            display: flex;
          }
          button {
            padding: 4px 8px !important;
            font-size: 0.8em !important;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .historyTable {
            font-size: 0.75em;
          }
          .investmentTablehead {
            gap: 6px;
            padding: 6px 10px;
          }
          .unitheadsect {
            padding: 6px 0;
          }
          button {
            padding: 3px 6px !important;
            font-size: 0.7em !important;
          }
          .statusFilter {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .statusFilter button {
            padding: 6px 10px !important;
            font-size: 0.8em !important;
          }

        /* CSS classes for dynamic content */
        .withdrawPaymentMethodCell,
        .withdrawWalletCell {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .walletAddressText {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.85em;
        }

        /* Status badge styling */
        .statusBadge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          border: none;
        }

        .status-pending {
          background-color: rgba(249, 248, 113, 0.2);
          color: var(--yellow-clr);
          border: 1px solid rgba(249, 248, 113, 0.3);
        }

        .status-rejected,
        .status-expired {
          background-color: rgba(220, 18, 98, 0.2);
          color: var(--danger-clr);
          border: 1px solid rgba(220, 18, 98, 0.3);
        }

        .status-active {
          background-color: rgba(45, 193, 148, 0.2);
          color: var(--green-clr);
          border: 1px solid rgba(45, 193, 148, 0.3);
        }

        /* Action Button Styles */
        .actionButton {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .approveButton {
          background: linear-gradient(135deg, var(--green-clr), #24b383);
          color: white;
        }

        .approveButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #24b383, #1fa876);
          box-shadow: 0 4px 12px rgba(45, 193, 148, 0.4);
          transform: translateY(-2px);
        }

        .approveButton:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(45, 193, 148, 0.3);
        }

        .rejectButton {
          background: linear-gradient(135deg, var(--danger-clr), #b91051);
          color: white;
        }

        .rejectButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91051, #9d0a45);
          box-shadow: 0 4px 12px rgba(220, 18, 98, 0.4);
          transform: translateY(-2px);
        }

        .rejectButton:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(220, 18, 98, 0.3);
        }

        .viewButton {
          background: linear-gradient(135deg, var(--sec-clr), #ff7a1f);
          color: white;
          border: none;
        }

        .viewButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff7a1f, #ff6a05);
          box-shadow: 0 4px 12px rgba(255, 140, 55, 0.4);
          transform: translateY(-2px);
        }

        .viewButton:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(255, 140, 55, 0.3);
        }

        .actionButton.loading,
        .actionButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
        }

        .actionButtonsCell {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .cardActions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .cardActions button {
          flex: 1;
          min-width: 100px;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .cardActions .approveButton {
          background: linear-gradient(135deg, var(--green-clr), #24b383);
          color: white;
        }

        .cardActions .approveButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #24b383, #1fa876);
          box-shadow: 0 4px 12px rgba(45, 193, 148, 0.4);
          transform: translateY(-2px);
        }

        .cardActions .rejectButton {
          background: linear-gradient(135deg, var(--danger-clr), #b91051);
          color: white;
        }

        .cardActions .rejectButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91051, #9d0a45);
          box-shadow: 0 4px 12px rgba(220, 18, 98, 0.4);
          transform: translateY(-2px);
        }

        .cardActions .viewButton {
          background: linear-gradient(135deg, var(--sec-clr), #ff7a1f);
          color: white;
        }

        .cardActions .viewButton:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff7a1f, #ff6a05);
          box-shadow: 0 4px 12px rgba(255, 140, 55, 0.4);
          transform: translateY(-2px);
        }

        /* Mobile Card Styles */
        .withdrawalTableWrapper {
          display: block;
        }

        .withdrawalCardsContainer {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .withdrawalCard {
          background-color: var(--dark-clr4);
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--opac-clr3);
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }

        .withdrawalCard:hover {
          background-color: var(--dark-clr3);
          box-shadow: 0 6px 16px rgba(255, 140, 55, 0.15);
          border-color: var(--sec-clr);
        }

        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--sec-clr);
          padding-bottom: 10px;
          margin-bottom: 12px;
          gap: 10px;
        }

        .cardTitle {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-clr1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cardAmount {
          font-weight: 700;
          font-size: 1.2em;
          color: var(--green-clr);
          text-align: right;
        }

        .cardTransactionId {
          font-size: 0.8em;
          font-family: 'Courier New', monospace;
          color: var(--text-deco);
        }

        .cardRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 8px;
        }

        .cardRow:last-child {
          border-bottom: none;
        }

        .cardLabel {
          font-weight: 700;
          color: var(--text-deco);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          min-width: fit-content;
        }

        .cardValue {
          color: var(--text-clr1);
          text-align: right;
          flex: 1;
          margin-left: 8px;
          font-size: 13px;
          word-break: break-word;
        }

        .statusBadgeMobile {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          border: none;
        }

        .statusBadgeMobile.status-pending {
          background-color: rgba(249, 248, 113, 0.2);
          color: var(--yellow-clr);
          border: 1px solid rgba(249, 248, 113, 0.3);
        }

        .statusBadgeMobile.status-rejected,
        .statusBadgeMobile.status-expired {
          background-color: rgba(220, 18, 98, 0.2);
          color: var(--danger-clr);
          border: 1px solid rgba(220, 18, 98, 0.3);
        }

        .statusBadgeMobile.status-active {
          background-color: rgba(45, 193, 148, 0.2);
          color: var(--green-clr);
          border: 1px solid rgba(45, 193, 148, 0.3);
        }

        .copyButtonSmall {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          font-size: 14px;
          transition: transform 0.2s ease;
          color: var(--text-clr1);
        }

        .copyButtonSmall:hover {
          transform: scale(1.1);
        }

        .copyButtonSmall.copied {
          color: var(--green-clr);
        }

        /* Responsive Mobile Views */
        @media (max-width: 1400px) {
          .withdrawalTable {
            font-size: 13px;
          }

          .withdrawalTable th,
          .withdrawalTable td {
            padding: 14px 8px;
          }

          .withdrawalTable th:first-child {
            width: 45px;
            padding: 14px 6px;
          }

          .withdrawalTable th:nth-child(2) {
            width: 80px;
          }

          .withdrawalTable th:nth-child(3) {
            width: 95px;
          }

          .withdrawalTable th:nth-child(4) {
            width: 85px;
          }

          .withdrawalTable th:nth-child(5),
          .withdrawalTable th:nth-child(6) {
            width: 100px;
          }

          .withdrawalTable th:nth-child(7) {
            width: 85px;
          }

          .withdrawalTable th:nth-child(8) {
            width: 95px;
          }

          .withdrawalTable th:last-child {
            width: 120px;
            padding: 14px 6px;
          }
        }

        @media (max-width: 1200px) {
          .withdrawalTable {
            font-size: 12px;
          }

          .withdrawalTable th,
          .withdrawalTable td {
            padding: 12px 6px;
          }

          .withdrawalTable th:first-child {
            width: 40px;
            padding: 12px 4px;
          }

          .withdrawalTable th:nth-child(2) {
            width: 70px;
          }

          .withdrawalTable th:nth-child(3) {
            width: 85px;
          }

          .withdrawalTable th:nth-child(4) {
            width: 75px;
          }

          .withdrawalTable th:nth-child(5),
          .withdrawalTable th:nth-child(6) {
            width: 90px;
          }

          .withdrawalTable th:nth-child(7) {
            width: 75px;
          }

          .withdrawalTable th:nth-child(8) {
            width: 85px;
          }

          .withdrawalTable th:last-child {
            width: 110px;
            padding: 12px 4px;
          }
        }

        @media (max-width: 1024px) {
          .withdrawalTableWrapper {
            display: none;
          }

          .withdrawalCardsContainer {
            display: flex;
            padding: 0 8px;
          }

          .withdrawalCard {
            padding: 12px;
            margin-bottom: 10px;
          }

          .cardLabel {
            font-size: 10px;
          }

          .cardValue {
            font-size: 12px;
          }

          .cardAmount {
            font-size: 1.1em;
          }

          .cardActions button {
            padding: 7px 10px;
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .withdrawalCard {
            padding: 11px;
            border-radius: 8px;
          }

          .cardHeader {
            padding-bottom: 8px;
            margin-bottom: 10px;
          }

          .cardTitle {
            font-size: 12px;
          }

          .cardRow {
            padding: 8px 0;
            font-size: 12px;
          }

          .cardLabel {
            font-size: 9px;
          }

          .cardValue {
            font-size: 11px;
          }

          .cardActions {
            gap: 6px;
            margin-top: 10px;
          }

          .cardActions button {
            padding: 8px 10px;
            font-size: 11px;
            flex: 1;
            min-width: auto;
          }

          .actionButton {
            padding: 7px 10px;
            font-size: 11px;
          }
        }

        @media (max-width: 640px) {
          .withdrawalCard {
            padding: 10px;
            margin-bottom: 8px;
          }

          .cardRow {
            padding: 6px 0;
            flex-wrap: wrap;
          }

          .cardLabel {
            font-size: 9px;
            flex: 0 0 40%;
          }

          .cardValue {
            font-size: 11px;
            text-align: left;
            flex: 0 0 60%;
            margin-left: 0;
          }

          .cardActions {
            gap: 5px;
            margin-top: 8px;
          }

          .cardActions button {
            padding: 6px 8px;
            font-size: 10px;
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .withdrawalCard {
            padding: 9px;
            margin-bottom: 8px;
          }

          .cardHeader {
            padding-bottom: 8px;
            margin-bottom: 8px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .cardTitle {
            font-size: 11px;
          }

          .statusBadgeMobile {
            padding: 4px 8px;
            font-size: 9px;
          }

          .cardRow {
            padding: 5px 0;
            font-size: 11px;
          }

          .cardLabel {
            font-size: 8px;
            flex: 0 0 45%;
          }

          .cardValue {
            font-size: 10px;
            flex: 0 0 55%;
          }

          .cardAmount {
            font-size: 1em;
          }

          .cardActions {
            gap: 4px;
            margin-top: 6px;
            flex-direction: column;
          }

          .cardActions button {
            width: 100%;
            padding: 6px 8px;
            font-size: 9px;
          }

          .actionButton {
            padding: 6px 8px;
            font-size: 9px;
          }
        }
        }
      `}</style>
      <div className="overviewSection">
        <div className="dashboardStats">
          <div className="statCard">
            <h3>Total Withdrawals</h3>
            <h2>${withdrawalStats.totalAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Pending Amount</h3>
            <h2>${withdrawalStats.pendingAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Completed Amount</h3>
            <h2>${withdrawalStats.completedAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Total Fees</h3>
            <h2>${withdrawalStats.totalFees.toLocaleString()}</h2>
          </div>
        </div>
        <div className="filterSection">
          <div className="searchBox">
            <input 
              type="text" 
              placeholder="Search by transaction or user ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="statusFilter">
            <button 
              className={filterStatus === 'all' ? 'active' : ''} 
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={filterStatus === 'Active' ? 'active' : ''} 
              onClick={() => setFilterStatus('Active')}
            >
              Completed
            </button>
            <button 
              className={filterStatus === 'Pending' ? 'active' : ''} 
              onClick={() => setFilterStatus('Pending')}
            >
              Pending
            </button>
            <button 
              className={filterStatus === 'Rejected' ? 'active' : ''} 
              onClick={() => setFilterStatus('Rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>
      <div className="myinvestmentSection">
        <h2>Withdrawals Stack ({filteredWithdrawals.length})</h2>
      {
          withdrawals.length > 0 ? (
              <div className="simplifiedWithdrawalsList">
                {
                  withdrawals.sort((a, b) => {
                      const dateA = new Date(a.created_at || a.date || 0);
                      const dateB = new Date(b.created_at || b.date || 0);
                      const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                      const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                      return timeB - timeA;
                  }).map((elem, idx) => {
                      const statusClass = (elem?.status || '').toLowerCase();
                      
                      return (
                        <div 
                          className="withdrawalListItem" 
                          key={`${elem.idnum}-withdraw-${idx}`}
                          onClick={() => {setWithdrawData(elem); setProfileState("Edit Withdraw")}}
                        >
                          <div className="withdrawalItemContent">
                            <div className="withdrawalItemLeft">
                              <div className="withdrawalAmount">${elem?.amount}</div>
                              <div className="withdrawalUserId">User: {elem?.idnum}</div>
                            </div>
                            <div className="withdrawalItemRight">
                              <span className={`statusBadge status-${statusClass}`}>{elem?.status}</span>
                              <div className="clickIndicator">→</div>
                            </div>
                          </div>
                        </div>
                      );
                  })
                }
              </div>
          ) : (
              <div className="emptyTable">
                  <i className="icofont-exclamation-tringle"></i>
                  <p>
                      You currently have no data in your withdrawal stack.
                  </p>
              </div>
          )
      }
    </div>
  </div>
  )
}

export default WithdrawAdmin
