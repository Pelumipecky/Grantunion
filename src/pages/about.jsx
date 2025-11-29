import {useState, useEffect} from 'react'
import Navbar from '../components/home/Navbar';
import Link from 'next/link';
import Footer from '../components/home/Footer';
import IframeSect from '../components/home/IframeSect';
import Testimonies from '../components/home/testimonies';
import Head from 'next/head';

const About = () => {
    const [showsidecard, setShowsideCard] = useState(false);
    const [showDisplayCard, setshowDisplayCard] = useState(false);

    const handleGrandMovementTraffic = (e) => {
        if (e.target.className === "profileIcon") {
        setshowDisplayCard(prev => !prev);
        } else {
        setshowDisplayCard(false);
        }
    }

    useEffect(() => {
        // Load the Google Translate API script dynamically
        const script = document.createElement('script');
        // script.type = 'text/javascript';
        script.src = 'https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js';
        script.async = true;
        document.head.appendChild(script);
    
        // Clean up the script tag when the component is unmounted
        return () => {
          document.head.removeChild(script);
        };
    }, []);
    
    return (
        <div className='HomefirstPageCtn aboutMainCtn conatctMain' onClick={handleGrandMovementTraffic}>
            <Head>
                <title>Contact</title>
                <meta property="og:title" content="About"/>
            </Head>
        <Navbar showsidecard={showsidecard} setShowsideCard={setShowsideCard} shownavOptions={false} showDisplayCard={showDisplayCard}/>
        <section className="sect1">
            <h1>What we are all about...</h1>
        </section>
        <div className="preSect">
            <Link href={"/"}>Home</Link>
            <span><i className="icofont-rounded-right"></i></span>
            <p>About</p>
        </div>
        <section id="about" className="about">

            <div className="whatareweabout">
              <div className="aboutimg"></div>
              <div className="abouttext">
                <h2>At Our Company</h2>
                <p>We are a legally operating trading/investment company. The company was created by a group of qualified experts, professional bankers, traders and analysts who specialized in <span>cryptocurrency</span>, <span>binary</span>, <span>the stock</span>, <span>bond</span>, <span>futures</span>, <span>currencies</span>, <span>gold</span>, <span>silver</span> and <span>oil trading</span> with having more than ten years of extensive practical experiences of combined personal skills, knowledge, talents and collective ambitions for success.</p>
                <p>We believe that superior investment performance is achieved through a skillful balance of three core attributes: knowledge, experience and adaptability. There is only one way to be on the cutting edge – commitment to innovation. We do our best to achieve a consistent increase in investment performance for our clients, and superior value-add. We appreciate our clients loyalty and value the relationships we build with each customer.</p>
                <Link className="borderBtn" href={"/about"}>More About Our Company...</Link>
              </div>
            </div>
            <coingecko-coin-price-marquee-widget  coin-ids="bitcoin,ethereum,eos,ripple,litecoin,tron,dogecoin,stellar,algorand,flow,dai,usdd,maker,astar,tezos,solana,neo,gala,cardano,aptos,helium,kava" currency="usd" background-color="#000613" locale="en"></coingecko-coin-price-marquee-widget>

            <div className="companyscopes">
              <div className="unitscope advantage">
                <h3>OUR ADVANTAGES</h3>
                <p>Our Investment Options are very fair and all transactional data is stored on Block chain, which allows to create, transfer and verify ultra-secure financial data without interference of third parties.</p>
              </div>
              <span className="vertSept" role="separator"></span>
              <div className="unitscope advantage">
                <h3>OUR GUARANTEES</h3>
                <p>We are here because we are passionate about open, transparent markets and aim to be a major driving force in widespread adoption, we assure you of maximum profit using our platform and of cause we will safeguard your data.</p>
              </div>
              <span className="vertSept" role="separator"></span>
              <div className="unitscope advantage">
                <h3>OUR MISSION</h3>
                <p>Our mission as a platform is to to help get you on the right track and earn out of every option even as you start your investing journey.</p>
              </div>
            </div>
          </section>
        <section className="pdf-content-section">
          <div className="pdf-content-container">
            <h2>Investment Guide & Platform Overview</h2>
            <div className="pdf-content-grid">
              <div className="pdf-section">
                <h3>Getting Started</h3>
                <div className="content-block">
                  <h4>Account Registration</h4>
                  <ul>
                    <li>Create your account with valid email and phone number</li>
                    <li>Complete KYC verification for full access</li>
                    <li>Set up two-factor authentication for security</li>
                    <li>Verify your identity documents</li>
                  </ul>
                </div>
                <div className="content-block">
                  <h4>Making Your First Deposit</h4>
                  <ul>
                    <li>Choose your preferred cryptocurrency (BTC/ETH)</li>
                    <li>Select investment plan based on your goals</li>
                    <li>Send exact amount to provided wallet address</li>
                    <li>Wait for 1-3 confirmations on blockchain</li>
                  </ul>
                </div>
              </div>

              <div className="pdf-section">
                <h3>Investment Plans</h3>
                <div className="plans-overview">
                  <div className="plan-card">
                    <h4>Starter Plan</h4>
                    <p className="plan-amount">$200 - $999</p>
                    <p className="plan-roi">5% Daily ROI</p>
                    <p className="plan-duration">5 Days Duration</p>
                  </div>
                  <div className="plan-card">
                    <h4>Professional Plan</h4>
                    <p className="plan-amount">$1,000 - $4,999</p>
                    <p className="plan-roi">7% Daily ROI</p>
                    <p className="plan-duration">7 Days Duration</p>
                  </div>
                  <div className="plan-card">
                    <h4>Premium Plan</h4>
                    <p className="plan-amount">$5,000 - $9,999</p>
                    <p className="plan-roi">10% Daily ROI</p>
                    <p className="plan-duration">10 Days Duration</p>
                  </div>
                  <div className="plan-card">
                    <h4>VIP Plan</h4>
                    <p className="plan-amount">$10,000+</p>
                    <p className="plan-roi">15% Daily ROI</p>
                    <p className="plan-duration">15 Days Duration</p>
                  </div>
                </div>
              </div>

              <div className="pdf-section">
                <h3>How It Works</h3>
                <div className="content-block">
                  <h4>Investment Process</h4>
                  <ol>
                    <li><strong>Deposit:</strong> Send cryptocurrency to your personal wallet address</li>
                    <li><strong>Confirmation:</strong> Wait for blockchain confirmation (1-3 blocks)</li>
                    <li><strong>Activation:</strong> Admin approves and activates your investment</li>
                    <li><strong>Earnings:</strong> Start receiving daily ROI payments automatically</li>
                    <li><strong>Withdrawal:</strong> Withdraw profits anytime after 24 hours</li>
                  </ol>
                </div>
                <div className="content-block">
                  <h4>Payment Methods</h4>
                  <ul>
                    <li><strong>Bitcoin (BTC):</strong> Most popular cryptocurrency</li>
                    <li><strong>Ethereum (ETH):</strong> Smart contract platform</li>
                    <li><strong>Minimum Deposit:</strong> $200 USD equivalent</li>
                    <li><strong>Withdrawal Fee:</strong> Network fees only</li>
                  </ul>
                </div>
              </div>

              <div className="pdf-section">
                <h3>Security & Safety</h3>
                <div className="content-block">
                  <h4>Platform Security</h4>
                  <ul>
                    <li>Bank-level SSL encryption</li>
                    <li>Cold storage for funds</li>
                    <li>Multi-signature wallets</li>
                    <li>Regular security audits</li>
                    <li>DDoS protection</li>
                  </ul>
                </div>
                <div className="content-block">
                  <h4>Blockchain Technology</h4>
                  <ul>
                    <li>All transactions recorded on blockchain</li>
                    <li>Transparent and immutable ledger</li>
                    <li>No third-party interference</li>
                    <li>Ultra-secure financial data</li>
                    <li>Real-time transaction monitoring</li>
                  </ul>
                </div>
              </div>

              <div className="pdf-section">
                <h3>Support & Resources</h3>
                <div className="content-block">
                  <h4>Customer Support</h4>
                  <ul>
                    <li>24/7 Live Chat Support</li>
                    <li>Email: contact@grantunioninvestment.com</li>
                    <li>Telegram: @GrantUnionInvestment</li>
                    <li>Discord Community</li>
                    <li>Comprehensive FAQ Section</li>
                  </ul>
                </div>
                <div className="content-block">
                  <h4>Educational Resources</h4>
                  <ul>
                    <li>Investment Strategy Guides</li>
                    <li>Cryptocurrency Basics</li>
                    <li>Risk Management Tips</li>
                    <li>Market Analysis Reports</li>
                    <li>Weekly Webinars</li>
                  </ul>
                </div>
              </div>

              <div className="pdf-section">
                <h3>Terms & Conditions</h3>
                <div className="content-block">
                  <h4>Important Notes</h4>
                  <ul>
                    <li>All investments carry risk of loss</li>
                    <li>Past performance doesn&apos;t guarantee future results</li>
                    <li>Minimum investment period applies</li>
                    <li>Withdrawals processed within 24-48 hours</li>
                    <li>Platform reserves right to modify terms</li>
                  </ul>
                </div>
                <div className="download-section">
                  <h4>Download Full Guide</h4>
                  <p>Get the complete investment guide in your preferred language:</p>
                  <div className="language-links">
                    <a href="/downloads/guide-en.pdf" className="lang-link" download>🇬🇧 English</a>
                    <a href="/downloads/guide-es.pdf" className="lang-link" download>🇪🇸 Spanish</a>
                    <a href="/downloads/guide-pt.pdf" className="lang-link" download>🇵🇹 Portuguese</a>
                    <a href="/downloads/guide-fr.pdf" className="lang-link" download>🇫🇷 French</a>
                    <a href="/downloads/guide-de.pdf" className="lang-link" download>🇩🇪 German</a>
                    <a href="/downloads/guide-it.pdf" className="lang-link" download>🇮🇹 Italian</a>
                    <a href="/downloads/guide-zh.pdf" className="lang-link" download>🇨🇳 Chinese</a>
                    <a href="/downloads/guide-ja.pdf" className="lang-link" download>🇯🇵 Japanese</a>
                    <a href="/downloads/guide-ko.pdf" className="lang-link" download>🇰🇷 Korean</a>
                    <a href="/downloads/guide-ru.pdf" className="lang-link" download>🇷🇺 Russian</a>
                    <a href="/downloads/guide-ar.pdf" className="lang-link" download>🇸🇦 Arabic</a>
                    <a href="/downloads/guide-hi.pdf" className="lang-link" download>🇮🇳 Hindi</a>
                    <a href="/downloads/guide-nl.pdf" className="lang-link" download>🇳🇱 Dutch</a>
                    <a href="/downloads/guide-tr.pdf" className="lang-link" download>🇹🇷 Turkish</a>
                    <a href="/downloads/guide-id.pdf" className="lang-link" download>🇮🇩 Indonesian</a>
                    <a href="/downloads/guide-th.pdf" className="lang-link" download>🇹🇭 Thai</a>
                    <a href="/downloads/guide-vi.pdf" className="lang-link" download>🇻🇳 Vietnamese</a>
                    <a href="/downloads/guide-pl.pdf" className="lang-link" download>🇵🇱 Polish</a>
                    <a href="/downloads/guide-sv.pdf" className="lang-link" download>🇸🇪 Swedish</a>
                    <a href="/downloads/guide-no.pdf" className="lang-link" download>🇳🇴 Norwegian</a>
                    <a href="/downloads/guide-da.pdf" className="lang-link" download>🇩🇰 Danish</a>
                    <a href="/downloads/guide-fi.pdf" className="lang-link" download>🇫🇮 Finnish</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Testimonies/>
        <Footer/>
    </div>
    )
}

export default About
