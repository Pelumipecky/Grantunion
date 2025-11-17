import {useState} from "react";
import TradingViewWidget from "./LengthyAnalytics";
import Analytics2 from "./Analytics2";
import AnalyticsViewWidget from "./Analytics3";
import styles from "./DashboardSect.module.css";
import { PLAN_CONFIG, formatPercent } from "../../utils/planConfig";

const DashboardSect = ({setWidgetState, currentUser, setInvestData}) => {
    const handlePlanInvest = (plan) => {
      setInvestData({
        idnum: currentUser?.idnum,
        plan: plan.name,
        status: "Pending",
        capital: plan.minCapital,
        date: new Date().toISOString(),
        duration: plan.durationDays,
        paymentOption: "Bitcoin",
        authStatus: "unseen",
        admin: false,
        roi: 0,
        bonus: 0
      });
      setWidgetState({
        state: true,
        type: "invest",
      });
    };
  return (
    <>
      <div className="dashboardContent">
        <div className="gridAnalytics">
          <div className="leftGridAnalaytics">
            <AnalyticsViewWidget />
          </div>
          <div className="rightGridAnalaytics">
            <Analytics2 />
          </div>
        </div>
        <div className="lengthyAnalytics">
          <TradingViewWidget />
        </div>
      </div>
        <section className={styles.packages} id="packages">
          <h2 className={styles.packagesTitle}>Investment Packages</h2>
        <div className={styles.packageGrid}>
          {PLAN_CONFIG.map((plan) => {
            const cardClass = `${styles.packageCard} ${plan.featured ? styles.diamond : ''}`;
            const buttonClass = `${styles.investButton} ${plan.featured ? styles.diamondButton : styles.standardButton}`;
            const sample = plan.sampleEarning.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return (
              <div className={cardClass} key={plan.id}>
                <div className={styles.packageTitle}>{plan.name}</div>
                <p className={styles.planSubtitle}>{plan.subtitle}</p>
                <div className={styles.packagePrice}>
                  <span>{formatPercent(plan.dailyRate)} daily commission</span>
                  <span>Term: {plan.durationLabel}</span>
                </div>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <i className={`icofont-tick-mark ${styles.featureIcon}`}></i>
                    <span className={styles.featureText}>Minimum deposit ${plan.minCapital.toLocaleString()}</span>
                  </li>
                  <li className={styles.featureItem}>
                    <i className={`icofont-tick-mark ${styles.featureIcon}`}></i>
                    <span className={styles.featureText}>Withdraw capital + earnings after {plan.durationLabel}</span>
                  </li>
                  <li className={styles.featureItem}>
                    <i className={`icofont-tick-mark ${styles.featureIcon}`}></i>
                    <span className={styles.featureText}>{formatPercent(plan.dailyRate)} credited daily</span>
                  </li>
                  <li className={styles.featureItem}>
                    <i className={`icofont-tick-mark ${styles.featureIcon}`}></i>
                    <span className={styles.featureText}>Earn ${sample} on ${plan.minCapital.toLocaleString()}</span>
                  </li>
                </ul>
                <button
                  className={buttonClass}
                  onClick={() => handlePlanInvest(plan)}
                >
                  Start Investing
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default DashboardSect;
