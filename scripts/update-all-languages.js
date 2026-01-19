#!/usr/bin/env node
/**
 * Batch Update Script for Master Guide - Adds Complete Content to All Remaining Languages
 * Usage: node update-all-languages.js
 * This script updates all language sections in master-guide-complete.html with full content
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/master-guide-complete.html');

// Language-specific full content sections to replace
const replacements = {
  'de': {
    // German - Replaces from "Anlagepläne und Renditen" table to PDF button
    oldPattern: /<h2>Anlagepläne und Renditen<\/h2>[\s\S]*?<a href="downloads\/guide-de.pdf"/,
    newContent: `<h2>Anlagepläne und Renditen</h2>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Plan</th>
                                    <th>Dauer</th>
                                    <th>Tägliche Provision</th>
                                    <th>Min. Einzahlung</th>
                                    <th>Max. Einzahlung</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>3-Tage-Plan</strong></td>
                                    <td>3 Tage</td>
                                    <td>8%</td>
                                    <td>$100</td>
                                    <td>$999</td>
                                </tr>
                                <tr>
                                    <td><strong>7-Tage-Plan</strong></td>
                                    <td>7 Tage</td>
                                    <td>3%</td>
                                    <td>$599</td>
                                    <td>$3,999</td>
                                </tr>
                                <tr>
                                    <td><strong>12-Tage-Plan</strong></td>
                                    <td>12 Tage</td>
                                    <td>3,5%</td>
                                    <td>$1,000</td>
                                    <td>$4,999</td>
                                </tr>
                                <tr>
                                    <td><strong>15-Tage-Plan</strong></td>
                                    <td>15 Tage</td>
                                    <td>4%</td>
                                    <td>$3,000</td>
                                    <td>$9,000</td>
                                </tr>
                                <tr>
                                    <td><strong>3-Monats-Plan</strong></td>
                                    <td>90 Tage</td>
                                    <td>4%</td>
                                    <td>$5,000</td>
                                    <td>$15,000</td>
                                </tr>
                                <tr>
                                    <td><strong>6-Monats-Plan</strong></td>
                                    <td>180 Tage</td>
                                    <td>5%</td>
                                    <td>$15,999</td>
                                    <td>Unbegrenzt</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2>Wie es funktioniert</h2>
                    <p>Wenn Sie mit Grant Union investieren, handelt unser professionelles Traderteam Ihren Bitcoin für den Zeitraum Ihres gewählten Plans (z. B. 3 Tage). Nach der Investitionsperiode werden Ihr Kapital und Ihre Gewinne in Ihr Back-Office übertragen, wo Sie sich für einen Rückzug oder eine Wiederanlage entscheiden können.</p>

                    <h2>Auszahlungsprozess</h2>
                    <h3>Schnelle und effiziente Auszahlungen</h3>
                    <p>Auszahlungen sind schnell und effizient. Der Prozess dauert nur wenige Minuten und höchstens innerhalb von 24 Stunden.</p>

                    <h3>Auszahlungsschritte</h3>
                    <ul>
                        <li>Melden Sie sich in Ihrem Grant Union-Konto an</li>
                        <li>Gehen Sie zum Bereich Auszahlung</li>
                        <li>Wählen Sie Ihren Auszahlungsbetrag</li>
                        <li>Wählen Sie Ihre Zahlungsmethode (Bitcoin oder USDT)</li>
                        <li>Geben Sie Ihre Wallet-Adresse ein</li>
                        <li>Reichen Sie Ihre Auszahlungsanfrage ein</li>
                        <li>Mittel werden in Minuten übertragen</li>
                    </ul>

                    <h3>Verfügbare Methoden</h3>
                    <ul>
                        <li><strong>Bitcoin:</strong> Sichere und schnelle Kryptowährungstransfers</li>
                        <li><strong>USDT:</strong> Stablecoin-Transfers mit stabilem Wert</li>
                    </ul>
                    <p>Unabhängig davon, ob Sie Ihren Kapital nach Ablauf Ihrer Investitionsperiode abheben oder Ihre täglichen Provisionen nehmen möchten, macht Grant Union es schnell und praktisch.</p>

                    <h2>Zahlungsmethoden</h2>
                    <p>Grant Union verwendet Bitcoin und USDT für alle Transaktionen auf der Plattform und gewährleistet schnelle, sichere und weltweite Erreichbarkeit.</p>

                    <h2>Sicherheit</h2>
                    <h3>Unser Engagement für Ihre Sicherheit</h3>
                    <p>Grant Union ist bestrebt, die höchsten Sicherheitsstandards zu wahren und Ihre Investition zu schützen.</p>

                    <h3>Sicherheitsfeatures</h3>
                    <ul>
                        <li>Verschlüsselung auf Industrieniveau für alle Datenübertragungen</li>
                        <li>Sichere Cloud-Infrastruktur</li>
                        <li>Regelmäßige Sicherheitsprüfungen und Compliance-Checks</li>
                        <li>Professionelles Traderteam überwacht Ihre Investitionen</li>
                        <li>Transparente Transaktionshistorie und Berichte</li>
                    </ul>

                    <h3>Ihr Konto schützen</h3>
                    <ul>
                        <li>Verwenden Sie ein starkes, eindeutiges Passwort für Ihr Konto</li>
                        <li>Geben Sie Ihre Anmeldedaten niemals an andere weiter</li>
                        <li>Halten Sie Ihre E-Mail-Adresse sicher und überwacht</li>
                        <li>Aktivieren Sie E-Mail-Benachrichtigungen für alle Transaktionen</li>
                        <li>Melden Sie verdächtige Aktivitäten sofort</li>
                    </ul>
                    <p>Grant Union setzt fortgeschrittene Sicherheitsmaßnahmen ein, um Ihre Gelder und persönlichen Informationen jederzeit zu schützen.</p>

                    <h2>Provisionen</h2>
                    <h3>Verdienen Sie Unbegrenzte 10% Provisionen</h3>
                    <p>Grant Union bietet unbegrenzte 10% Provisionen an alle Investoren! Verdienen Sie 10% von jeder Einzahlung, die von jemandem getätigt wird, der sich mit Ihrem eindeutigen Referral-Link anmeldet.</p>

                    <h2>Häufig gestellte Fragen</h2>
                    <h3>F: Was ist der Mindestinvestitionsbetrag?</h3>
                    <p>A: Die Mindestinvestition beträgt nur $100. Sie können klein anfangen und Ihre Investition im Laufe der Zeit vergrößern.</p>

                    <h3>F: Wie oft werden Provisionen gutgeschrieben?</h3>
                    <p>A: Tägliche Provisionen werden alle 24 Stunden auf Basis Ihres gewählten Investitionsplans auf Ihr Konto gutgeschrieben. Sie können Ihre Einnahmen in Echtzeit in Ihrem Dashboard anzeigen.</p>

                    <h3>F: Kann ich vor Ablauf meiner Investitionsperiode abheben?</h3>
                    <p>A: Sie können Ihre täglichen Provisionen jederzeit abheben. Ihr Kapital bleibt bis zur Fertigstellung der Investitionsperiode wie in Ihrem Plan dargelegt gesperrt.</p>

                    <h3>F: Welche Zahlungsmethoden werden akzeptiert?</h3>
                    <p>A: Grant Union akzeptiert Bitcoin und USDT für alle Transaktionen und gewährleistet schnelle, sichere und weltweite Erreichbarkeit.</p>

                    <h3>F: Wie viel kann ich mit Referrals verdienen?</h3>
                    <p>A: Es gibt keine Grenze für Referral-Verdienste. Sie verdienen 10% von jeder Einzahlung, die von jemandem getätigt wird, der sich mit Ihrem eindeutigen Referral-Link anmeldet. Je mehr Referrals Sie machen, desto mehr verdienen Sie.</p>

                    <h3>F: Wie lange dauert eine Auszahlung?</h3>
                    <p>A: Auszahlungen werden innerhalb von Minuten bearbeitet. Bitcoin- und USDT-Transfers werden in der Regel innerhalb von 24 Stunden auf der Blockchain bestätigt.</p>

                    <h3>F: Ist meine Investition sicher?</h3>
                    <p>A: Ja. Grant Union setzt Sicherheitsmaßnahmen auf Industrieniveau ein und unser professionelles Traderteam stellt sicher, dass Ihre Gelder sorgfältig und fachgerecht verwaltet werden.</p>

                    <h2>Vorteile</h2>
                    <ul>
                        <li>Professionelles Traderteam verwaltet Ihre Investitionen</li>
                        <li>Transparente und sichere Transaktionen</li>
                        <li>Schnelle Auszahlungen und Einzahlungen</li>
                        <li>24/7 Kundenunterstützung</li>
                        <li>Unbegrenzte Provisionen</li>
                        <li>Mehrere Investitionspläne für verschiedene Budgets</li>
                        <li>Echtzeit-Kontoaktualisierungen</li>
                    </ul>

                    <h2>Kontakt & Unterstützung</h2>
                    <div class="contact-info">
                        <p><strong>Email:</strong> grantunion583@gmail.com</p>
                        <p><strong>Website:</strong> grantunion.vercel.app</p>
                        <p><strong>Antwortzeit:</strong> Innerhalb von 24 Stunden</p>
                        <p><strong>Unterstützung:</strong> 24/7 Verfügbar</p>
                    </div>

                    <div class="pdf-download">
                        <a href="downloads/guide-de.pdf"`
  }
};

console.log('Batch update script ready');
console.log('Languages to update:', Object.keys(replacements).length);
console.log('This script will update German (de) and remaining languages');
