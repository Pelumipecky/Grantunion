const fs = require('fs');
const path = require('path');

// Content translations for all sections
const translations = {
  fr: {
    howitworks: "Comment Ça Fonctionne",
    howitworks_desc: "Lorsque vous investissez avec Grant Union, notre équipe professionnelle de traders échange votre Bitcoin pour la période de votre plan choisi (par exemple, 3 jours). Après la période d'investissement, votre capital et vos gains sont transférés à votre back-office, où vous pouvez choisir de retirer ou de réinvestir.",
    withdrawal: "Processus de Retrait",
    withdrawal_quick: "Retraits Rapides et Efficaces",
    withdrawal_quick_desc: "Les retraits sont rapides et efficaces. Le processus ne prend que quelques minutes, au maximum dans les 24 heures.",
    withdrawal_steps: "Étapes de Retrait",
    step1: "Connectez-vous à votre compte Grant Union",
    step2: "Accédez à la section Retrait",
    step3: "Sélectionnez votre montant de retrait",
    step4: "Choisissez votre méthode de paiement (Bitcoin ou USDT)",
    step5: "Entrez votre adresse portefeuille",
    step6: "Soumettez votre demande de retrait",
    step7: "Les fonds sont transférés en minutes",
    available_methods: "Méthodes Disponibles",
    bitcoin_desc: "Transferts de crypto-monnaies sécurisés et rapides",
    usdt_desc: "Transferts de stablecoin avec valeur stable",
    withdrawal_convenient: "Que vous souhaitiez retirer votre capital après la fin de votre période d'investissement ou prélever vos commissions quotidiennes, Grant Union le rend rapide et pratique.",
    safety: "Sécurité et Sûreté",
    commitment: "Notre Engagement envers Votre Sécurité",
    commitment_desc: "Grant Union s'engage à maintenir les plus hauts standards de sécurité et à protéger votre investissement.",
    security_features: "Caractéristiques de Sécurité",
    feature1: "Chiffrement de niveau industriel pour toute transmission de données",
    feature2: "Infrastructure cloud sécurisée",
    feature3: "Audits de sécurité réguliers et vérifications de conformité",
    feature4: "Équipe de trading professionnelle surveillant vos investissements",
    feature5: "Historique de transactions transparent et rapports",
    protecting: "Protéger Votre Compte",
    protect1: "Utilisez un mot de passe fort et unique pour votre compte",
    protect2: "Ne partagez jamais vos identifiants de connexion avec quiconque",
    protect3: "Gardez votre adresse e-mail sécurisée et surveillée",
    protect4: "Activez les notifications par e-mail pour toutes les transactions",
    protect5: "Signalez immédiatement toute activité suspecte",
    protect_desc: "Grant Union emploie des mesures de sécurité avancées pour protéger vos fonds et vos informations personnelles à tout moment.",
    faq: "Questions Fréquemment Posées",
    q1: "Q: Quel est le montant d'investissement minimum?",
    a1: "R: L'investissement minimum est seulement de $100. Vous pouvez commencer petit et développer votre investissement au fil du temps.",
    q2: "Q: À quelle fréquence les commissions sont-elles crédités?",
    a2: "R: Les commissions quotidiennes sont crédités à votre compte toutes les 24 heures en fonction de votre plan d'investissement choisi. Vous pouvez voir vos gains en temps réel sur votre tableau de bord.",
    q3: "Q: Puis-je retirer avant la fin de ma période d'investissement?",
    a3: "R: Vous pouvez retirer vos commissions quotidiennes à tout moment. Votre capital reste bloqué jusqu'à la fin de la période d'investissement comme indiqué dans votre plan.",
    q4: "Q: Quelles méthodes de paiement sont acceptées?",
    a4: "R: Grant Union accepte Bitcoin et USDT pour toutes les transactions, garantissant un accès rapide, sécurisé et mondial.",
    q5: "Q: Combien puis-je gagner avec les références?",
    a5: "R: Il n'y a pas de limite aux gains de références. Vous gagnez 10% de chaque dépôt effectué par quiconque s'inscrit en utilisant votre lien de parrainage unique. Plus vous faites de références, plus vous gagnez.",
    q6: "Q: Combien de temps dure le retrait?",
    a6: "R: Les retraits sont traités en quelques minutes. Les transferts Bitcoin et USDT sont généralement confirmés sur la blockchain dans les 24 heures.",
    q7: "Q: Mon investissement est-il sécurisé?",
    a7: "R: Oui. Grant Union utilise des mesures de sécurité de niveau industriel et notre équipe de trading professionnelle garantit que vos fonds sont gérés avec soin et expertise."
  },
  de: {
    howitworks: "Wie es funktioniert",
    howitworks_desc: "Wenn Sie mit Grant Union investieren, handelt unser professionelles Traderteam Ihren Bitcoin für den Zeitraum Ihres gewählten Plans (z. B. 3 Tage). Nach der Investitionsperiode werden Ihr Kapital und Ihre Gewinne in Ihr Back-Office übertragen, wo Sie sich für einen Rückzug oder eine Wiederanlage entscheiden können.",
    withdrawal: "Auszahlungsprozess",
    withdrawal_quick: "Schnelle und effiziente Auszahlungen",
    withdrawal_quick_desc: "Auszahlungen sind schnell und effizient. Der Prozess dauert nur wenige Minuten und höchstens innerhalb von 24 Stunden.",
    withdrawal_steps: "Auszahlungsschritte",
    step1: "Melden Sie sich in Ihrem Grant Union-Konto an",
    step2: "Gehen Sie zum Bereich Auszahlung",
    step3: "Wählen Sie Ihren Auszahlungsbetrag",
    step4: "Wählen Sie Ihre Zahlungsmethode (Bitcoin oder USDT)",
    step5: "Geben Sie Ihre Wallet-Adresse ein",
    step6: "Reichen Sie Ihre Auszahlungsanfrage ein",
    step7: "Mittel werden in Minuten übertragen",
    available_methods: "Verfügbare Methoden",
    bitcoin_desc: "Sichere und schnelle Kryptowährungstransfers",
    usdt_desc: "Stablecoin-Transfers mit stabilem Wert",
    withdrawal_convenient: "Unabhängig davon, ob Sie Ihren Kapital nach Ablauf Ihrer Investitionsperiode abheben oder Ihre tägliche Provisionen nehmen möchten, macht Grant Union es schnell und praktisch.",
    safety: "Sicherheit",
    commitment: "Unser Engagement für Ihre Sicherheit",
    commitment_desc: "Grant Union ist bestrebt, die höchsten Sicherheitsstandards zu wahren und Ihre Investition zu schützen.",
    security_features: "Sicherheitsfeatures",
    feature1: "Verschlüsselung auf Industrieniveau für alle Datenübertragungen",
    feature2: "Sichere Cloud-Infrastruktur",
    feature3: "Regelmäßige Sicherheitsprüfungen und Compliance-Checks",
    feature4: "Professionelles Traderteam überwacht Ihre Investitionen",
    feature5: "Transparente Transaktionshistorie und Berichte",
    protecting: "Ihr Konto schützen",
    protect1: "Verwenden Sie ein starkes, eindeutiges Passwort für Ihr Konto",
    protect2: "Geben Sie Ihre Anmeldedaten niemals an andere weiter",
    protect3: "Halten Sie Ihre E-Mail-Adresse sicher und überwacht",
    protect4: "Aktivieren Sie E-Mail-Benachrichtigungen für alle Transaktionen",
    protect5: "Melden Sie verdächtige Aktivitäten sofort",
    protect_desc: "Grant Union setzt fortgeschrittene Sicherheitsmaßnahmen ein, um Ihre Gelder und persönlichen Informationen jederzeit zu schützen.",
    faq: "Häufig gestellte Fragen",
    q1: "F: Was ist der Mindestinvestitionsbetrag?",
    a1: "A: Die Mindestinvestition beträgt nur $100. Sie können klein anfangen und Ihre Investition im Laufe der Zeit vergrößern.",
    q2: "F: Wie oft werden Provisionen gutgeschrieben?",
    a2: "A: Tägliche Provisionen werden alle 24 Stunden auf Basis Ihres gewählten Investitionsplans auf Ihr Konto gutgeschrieben. Sie können Ihre Einnahmen in Echtzeit in Ihrem Dashboard anzeigen.",
    q3: "F: Kann ich vor Ablauf meiner Investitionsperiode abheben?",
    a3: "A: Sie können Ihre täglichen Provisionen jederzeit abheben. Ihr Kapital bleibt bis zur Fertigstellung der Investitionsperiode wie in Ihrem Plan dargelegt gesperrt.",
    q4: "F: Welche Zahlungsmethoden werden akzeptiert?",
    a4: "A: Grant Union akzeptiert Bitcoin und USDT für alle Transaktionen und gewährleistet schnelle, sichere und weltweite Erreichbarkeit.",
    q5: "F: Wie viel kann ich mit Referrals verdienen?",
    a5: "A: Es gibt keine Grenze für Referral-Verdienste. Sie verdienen 10% von jeder Einzahlung, die von jemandem getätigt wird, der sich mit Ihrem eindeutigen Referral-Link anmeldet. Je mehr Referrals Sie machen, desto mehr verdienen Sie.",
    q6: "F: Wie lange dauert eine Auszahlung?",
    a6: "A: Auszahlungen werden innerhalb von Minuten bearbeitet. Bitcoin- und USDT-Transfers werden in der Regel innerhalb von 24 Stunden auf der Blockchain bestätigt.",
    q7: "F: Ist meine Investition sicher?",
    a7: "A: Ja. Grant Union setzt Sicherheitsmaßnahmen auf Industrieniveau ein und unser professionelles Traderteam stellt sicher, dass Ihre Gelder sorgfältig und fachgerecht verwaltet werden."
  }
};

// Function to generate complete section for a language
function generateCompleteSections(lang, isEnglish = false) {
  if (isEnglish) {
    return `
                    <h2>How It Works</h2>
                    <p>When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan (e.g., 3 days). After the investment period, your capital and earnings are transferred to your back office, where you can choose to withdraw or reinvest.</p>

                    <h2>Withdrawal Process</h2>
                    <h3>Quick & Efficient Withdrawals</h3>
                    <p>Withdrawals are quick and efficient. The process takes only a few minutes, and at most within 24 hours.</p>

                    <h3>Withdrawal Steps</h3>
                    <ul>
                        <li>Log in to your Grant Union account</li>
                        <li>Navigate to the Withdrawal section</li>
                        <li>Select your withdrawal amount</li>
                        <li>Choose your payment method (Bitcoin or USDT)</li>
                        <li>Enter your wallet address</li>
                        <li>Submit your withdrawal request</li>
                        <li>Funds are transferred within minutes</li>
                    </ul>

                    <h3>Available Methods</h3>
                    <ul>
                        <li><strong>Bitcoin:</strong> Secure and fast cryptocurrency transfers</li>
                        <li><strong>USDT:</strong> Stablecoin transfers with stable value</li>
                    </ul>
                    <p>Whether you want to withdraw your capital after your investment period ends or take your daily commissions, Grant Union makes it quick and convenient.</p>

                    <h2>Payment Methods</h2>
                    <p>Grant Union uses Bitcoin and USDT for all transactions on the platform, ensuring fast, secure, and global access.</p>

                    <h2>Safety & Security</h2>
                    <h3>Our Commitment to Your Security</h3>
                    <p>Grant Union is committed to maintaining the highest standards of security and protecting your investment.</p>

                    <h3>Security Features</h3>
                    <ul>
                        <li>Industry-leading encryption for all data transmission</li>
                        <li>Secure cloud infrastructure</li>
                        <li>Regular security audits and compliance checks</li>
                        <li>Professional trading team monitoring your investments</li>
                        <li>Transparent transaction history and reporting</li>
                    </ul>

                    <h3>Protecting Your Account</h3>
                    <ul>
                        <li>Use a strong, unique password for your account</li>
                        <li>Never share your login credentials with anyone</li>
                        <li>Keep your email address secure and monitored</li>
                        <li>Enable email notifications for all transactions</li>
                        <li>Report any suspicious activity immediately</li>
                    </ul>
                    <p>Grant Union employs advanced security measures to protect your funds and personal information at all times.</p>

                    <h2>Referral Commission</h2>
                    <h3>Earn Unlimited 10% Referral Commission</h3>
                    <p>Grant Union offers unlimited 10% referral commission to all investors! Earn 10% from every deposit made by anyone who signs up using your unique referral link.</p>

                    <h2>Frequently Asked Questions</h2>
                    <h3>Q: What is the minimum investment amount?</h3>
                    <p>A: The minimum investment is just $100. You can start small and grow your investment over time.</p>

                    <h3>Q: How often are commissions credited?</h3>
                    <p>A: Daily commissions are credited to your account every 24 hours based on your chosen investment plan. You can view your earnings in real-time on your dashboard.</p>

                    <h3>Q: Can I withdraw before my investment period ends?</h3>
                    <p>A: You can withdraw your daily commissions at any time. Your capital remains locked until the investment period completes as outlined in your plan.</p>

                    <h3>Q: What payment methods are accepted?</h3>
                    <p>A: Grant Union accepts Bitcoin and USDT for all transactions, ensuring fast, secure, and global accessibility.</p>

                    <h3>Q: How much can I earn from referrals?</h3>
                    <p>A: There is no limit on referral earnings. You earn 10% of every deposit made by anyone who registers using your referral link. The more referrals you make, the more you earn.</p>

                    <h3>Q: How long does withdrawal take?</h3>
                    <p>A: Withdrawals are processed within minutes. Bitcoin and USDT transfers are typically confirmed on the blockchain within 24 hours.</p>

                    <h3>Q: Is my investment secure?</h3>
                    <p>A: Yes. Grant Union employs industry-leading security measures and our professional trading team ensures your funds are managed with care and expertise.</p>`;
  }
  return '';
}

console.log('Script ready to update all language sections');
console.log('Languages available for translation:', Object.keys(translations));
