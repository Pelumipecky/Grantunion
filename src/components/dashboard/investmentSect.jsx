import styles from "./DashboardSect.module.css";
import { PLAN_CONFIG, formatPercent } from "../../utils/planConfig";

const InvestmentSect = ({ setWidgetState, setInvestData, currentUser, investments}) => {
  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth;

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
    <div className="investmentMainCntn">
      <div className="myinvestmentSection">
        <h2>Investments History</h2>
        {
            investments.length > 0 ? (
                <div className="historyTable">
                    <div className="investmentTablehead header">
                        <div className="unitheadsect">S/N</div>
                        <div className="unitheadsect">Plan</div>
                        <div className="unitheadsect">Capital</div>
                        <div className="unitheadsect">Status</div>
                        <div className="unitheadsect">Days Spent</div>
                        <div className="unitheadsect">Days Remaining</div>
                    </div>
                    {
                        investments.sort((a, b) => {
                          const dateA = new Date(a.date);
                          const dateB = new Date(b.date);
                        
                          return dateB - dateA;
                        }).map((elem, idx) => (
                            <div className="investmentTablehead" key={`${elem.id}-userDash_${idx}`}>
                                <div className="unitheadsect">{idx + 1}</div>
                                <div className="unitheadsect">{elem?.plan}</div>
                                <div className="unitheadsect">${elem?.capital.toLocaleString()}</div>
                                <div className="unitheadsect"><span style={{color: `${elem?.status === "Pending" ? "#F9F871" : elem?.status === "Expired" ? "#DC1262" : "#2DC194"}`}}>{elem?.status}</span></div>
                                <div className="unitheadsect">{elem?.status === "Pending" ? "0" : elem?.status === "Expired" ? "0" : `${Math.floor((new Date(dateString) - new Date(elem?.date)) / (1000 * 60 * 60 * 24)) + 1}`}</div>
                                <div className="unitheadsect">{elem?.status === "Pending" ? `${elem?.duration}` : elem?.status === "Expired" ? "0" : `${elem?.duration - (Math.floor((new Date(dateString) - new Date(elem?.date)) / (1000 * 60 * 60 * 24)) + 1)}`}</div>
                            </div>
                        ))
                    }
                </div>

            ) : (

                <div className="emptyTable">
                    <i className="icofont-exclamation-tringle"></i>
                    <p>
                        Your investment history is currently empty.{" "}
                        <a href="#packages">Invest now</a>
                    </p>
                </div>
            )
        }
        <section className={styles.packages} id="packages">
          <h2 className={styles.packagesTitle}>Our Available Packages</h2>
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
                    <span className={styles.featureText}>Withdraw after {plan.durationLabel}</span>
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
      </div>
    </div>
  );
};

export default InvestmentSect;
