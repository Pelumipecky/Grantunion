import { useState, useEffect } from 'react';
import { supabaseDb } from '../../database/supabaseUtils';
import styles from './DownlineSect.module.css';

const DownlineSect = ({ currentUser }) => {
  const [downline, setDownline] = useState([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    directCount: 0,
    indirectCount: 0,
    totalRewards: 0,
    pendingRewards: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDownlineData = async () => {
    if (!currentUser?.idnum) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch referral stats using the service
      const { data: statsData, error: statsError } = await supabaseDb.getReferralStats(currentUser.idnum);

      if (statsError) {
        console.error('Error fetching referral stats:', statsError);
        setError('Failed to load referral data');
      } else if (statsData) {
        setStats({
          totalReferrals: statsData.referralCount || 0,
          directCount: statsData.directCount || 0,
          indirectCount: statsData.indirectCount || 0,
          totalRewards: statsData.totalRewards || 0,
          pendingRewards: statsData.pendingRewards || 0,
        });
        setDownline(statsData.recentReferrals || []);
      }
    } catch (err) {
      console.error('Downline fetch error:', err);
      setError('Unable to load referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownlineData();
  }, [currentUser?.idnum]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <i className="icofont-spinner"></i>
        <p>Loading your downline...</p>
      </div>
    );
  }

  const referralLink = currentUser?.referralCode 
    ? `https://grantunion.vercel.app/signup?ref=${currentUser.referralCode}`
    : '';

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    }
  };

  return (
    <div className={styles.downlineContainer}>
      <h2 className={styles.title}>Your Referral Network</h2>

      {/* Referral Link Section */}
      {referralLink && (
        <div className={styles.referralLinkSection}>
          <div className={styles.linkHeader}>
            <i className="icofont-link"></i>
            <span>Your Referral Link</span>
          </div>
          <div className={styles.linkBox}>
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className={styles.linkInput}
            />
            <button onClick={copyReferralLink} className={styles.copyBtn}>
              <i className="icofont-ui-copy"></i> Copy
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="icofont-users-alt-5"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Referrals</div>
            <div className={styles.statValue}>{stats.totalReferrals}</div>
            <div className={styles.statMeta}>Active downline members</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="icofont-user-suited"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Direct Referrals</div>
            <div className={styles.statValue}>{stats.directCount}</div>
            <div className={styles.statMeta}>Level 1</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="icofont-users"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Indirect Referrals</div>
            <div className={styles.statValue}>{stats.indirectCount}</div>
            <div className={styles.statMeta}>Level 2+</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="icofont-dollar-true"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Rewards</div>
            <div className={styles.statValue}>${stats.totalRewards.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={styles.statMeta}>{stats.pendingRewards} pending</div>
          </div>
        </div>
      </div>

      {/* Downline Table */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>
          <i className="icofont-people"></i> Recent Referrals
        </h3>
        {downline && downline.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.downlineTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Referral Code</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {downline.map((referral, idx) => (
                  <tr key={referral.id || idx}>
                    <td className={styles.indexCell}>{idx + 1}</td>
                    <td className={styles.codeCell}>
                      <code>{referral.referral_code || referral.referralCode || 'N/A'}</code>
                    </td>
                    <td className={styles.nameCell}>{referral.user_name || referral.userName || 'N/A'}</td>
                    <td className={styles.emailCell}>{referral.email || 'N/A'}</td>
                    <td className={styles.levelCell}>
                      <span className={`${styles.levelBadge} ${styles[`level${referral.level || 1}`]}`}>
                        Level {referral.level || 1}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${styles[referral.status || 'active']}`}>
                        {referral.status || 'Active'}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {referral.created_at
                        ? new Date(referral.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="icofont-people"></i>
            <p>No referrals yet</p>
            <small>Share your referral link to start building your downline</small>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorState}>
          <i className="icofont-exclamation-tringle"></i>
          <p>{error}</p>
          <button onClick={fetchDownlineData} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default DownlineSect;
