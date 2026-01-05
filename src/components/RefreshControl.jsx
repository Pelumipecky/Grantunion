import React, { useState } from 'react';

/**
 * RefreshControl Component
 * Provides UI controls for auto-refresh functionality
 */
export const RefreshControl = ({ 
  isAutoRefreshEnabled, 
  onToggleAutoRefresh, 
  onManualRefresh, 
  isRefreshing, 
  lastRefreshed,
  refreshInterval,
  onRefreshIntervalChange 
}) => {
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);

  const formatLastRefreshed = () => {
    if (!lastRefreshed) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - lastRefreshed) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const refreshIntervalOptions = [
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
    { label: 'Off', value: 0 }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      background: 'rgba(255, 179, 71, 0.05)',
      border: '1px solid rgba(255, 179, 71, 0.2)',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      {/* Manual Refresh Button */}
      <button
        onClick={onManualRefresh}
        disabled={isRefreshing}
        title="Refresh now"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 179, 71, 0.3)',
          background: 'rgba(255, 179, 71, 0.1)',
          color: '#FFB347',
          cursor: isRefreshing ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          transition: 'all 0.2s ease',
          opacity: isRefreshing ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isRefreshing) {
            e.target.style.background = 'rgba(255, 179, 71, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 179, 71, 0.1)';
        }}
      >
        <i className={`icofont-refresh ${isRefreshing ? 'spinning' : ''}`} />
      </button>

      {/* Auto-Refresh Toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none'
      }}>
        <input
          type="checkbox"
          checked={isAutoRefreshEnabled}
          onChange={onToggleAutoRefresh}
          style={{
            width: '16px',
            height: '16px',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '0.9em', color: 'var(--text-clr1)' }}>
          Auto-refresh
        </span>
      </label>

      {/* Refresh Interval Selector */}
      {isAutoRefreshEnabled && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowIntervalMenu(!showIntervalMenu)}
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 179, 71, 0.1)',
              border: '1px solid rgba(255, 179, 71, 0.3)',
              color: 'var(--text-clr1)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85em',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 179, 71, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 179, 71, 0.1)';
            }}
          >
            {refreshInterval / 1000 >= 60 ? `${refreshInterval / 60000}m` : `${refreshInterval / 1000}s`}
            <i className="icofont-arrow-down" style={{ marginLeft: '6px' }} />
          </button>

          {showIntervalMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'var(--dark-clr3)',
              border: '1px solid rgba(255, 179, 71, 0.3)',
              borderRadius: '8px',
              marginTop: '4px',
              zIndex: 1000,
              minWidth: '100px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              {refreshIntervalOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onRefreshIntervalChange(option.value);
                    setShowIntervalMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: refreshInterval === option.value ? 'rgba(255, 179, 71, 0.2)' : 'transparent',
                    color: 'var(--text-clr1)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9em',
                    borderBottom: '1px solid rgba(255, 179, 71, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 179, 71, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = refreshInterval === option.value ? 'rgba(255, 179, 71, 0.2)' : 'transparent';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Last Refreshed Time */}
      <span style={{
        fontSize: '0.85em',
        color: 'rgba(255, 179, 71, 0.7)',
        marginLeft: 'auto'
      }}>
        Last: {formatLastRefreshed()}
      </span>

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RefreshControl;
