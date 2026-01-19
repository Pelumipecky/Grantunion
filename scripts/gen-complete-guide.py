#!/usr/bin/env python3
import re
import json

# Read the current file
with open('c:\\Users\\HP\\Pictures\\web design\\Grantunion-main\\Grantunion-main\\public\\master-guide-complete.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the content sections for all languages
sections = {
    'de': {
        'howitworks': 'Wie es funktioniert',
        'howitworks_desc': 'Wenn Sie mit Grant Union investieren, handelt unser professionelles Traderteam Ihren Bitcoin für den Zeitraum Ihres gewählten Plans (z. B. 3 Tage). Nach der Investitionsperiode werden Ihr Kapital und Ihre Gewinne in Ihr Back-Office übertragen, wo Sie sich für einen Rückzug oder eine Wiederanlage entscheiden können.',
        'withdrawal': 'Auszahlungsprozess',
        'withdrawal_quick': 'Schnelle und effiziente Auszahlungen',
        'withdrawal_quick_desc': 'Auszahlungen sind schnell und effizient. Der Prozess dauert nur wenige Minuten und höchstens innerhalb von 24 Stunden.',
        'withdrawal_steps': 'Auszahlungsschritte',
        'step1': 'Melden Sie sich in Ihrem Grant Union-Konto an',
        'step2': 'Gehen Sie zum Bereich Auszahlung',
        'step3': 'Wählen Sie Ihren Auszahlungsbetrag',
        'step4': 'Wählen Sie Ihre Zahlungsmethode (Bitcoin oder USDT)',
        'step5': 'Geben Sie Ihre Wallet-Adresse ein',
        'step6': 'Reichen Sie Ihre Auszahlungsanfrage ein',
        'step7': 'Mittel werden in Minuten übertragen',
        'available_methods': 'Verfügbare Methoden',
        'bitcoin_desc': 'Sichere und schnelle Kryptowährungstransfers',
        'usdt_desc': 'Stablecoin-Transfers mit stabilem Wert',
        'withdrawal_convenient': 'Unabhängig davon, ob Sie Ihren Kapital nach Ablauf Ihrer Investitionsperiode abheben oder Ihre täglichen Provisionen nehmen möchten, macht Grant Union es schnell und praktisch.',
        'safety': 'Sicherheit',
        'commitment': 'Unser Engagement für Ihre Sicherheit',
        'commitment_desc': 'Grant Union ist bestrebt, die höchsten Sicherheitsstandards zu wahren und Ihre Investition zu schützen.',
        'security_features': 'Sicherheitsfeatures',
        'feature1': 'Verschlüsselung auf Industrieniveau für alle Datenübertragungen',
        'feature2': 'Sichere Cloud-Infrastruktur',
        'feature3': 'Regelmäßige Sicherheitsprüfungen und Compliance-Checks',
        'feature4': 'Professionelles Traderteam überwacht Ihre Investitionen',
        'feature5': 'Transparente Transaktionshistorie und Berichte',
        'protecting': 'Ihr Konto schützen',
        'protect1': 'Verwenden Sie ein starkes, eindeutiges Passwort für Ihr Konto',
        'protect2': 'Geben Sie Ihre Anmeldedaten niemals an andere weiter',
        'protect3': 'Halten Sie Ihre E-Mail-Adresse sicher und überwacht',
        'protect4': 'Aktivieren Sie E-Mail-Benachrichtigungen für alle Transaktionen',
        'protect5': 'Melden Sie verdächtige Aktivitäten sofort',
        'protect_desc': 'Grant Union setzt fortgeschrittene Sicherheitsmaßnahmen ein, um Ihre Gelder und persönlichen Informationen jederzeit zu schützen.',
        'faq': 'Häufig gestellte Fragen',
        'q1': 'F: Was ist der Mindestinvestitionsbetrag?',
        'a1': 'A: Die Mindestinvestition beträgt nur $100. Sie können klein anfangen und Ihre Investition im Laufe der Zeit vergrößern.',
        'q2': 'F: Wie oft werden Provisionen gutgeschrieben?',
        'a2': 'A: Tägliche Provisionen werden alle 24 Stunden auf Basis Ihres gewählten Investitionsplans auf Ihr Konto gutgeschrieben. Sie können Ihre Einnahmen in Echtzeit in Ihrem Dashboard anzeigen.',
        'q3': 'F: Kann ich vor Ablauf meiner Investitionsperiode abheben?',
        'a3': 'A: Sie können Ihre täglichen Provisionen jederzeit abheben. Ihr Kapital bleibt bis zur Fertigstellung der Investitionsperiode wie in Ihrem Plan dargelegt gesperrt.',
        'q4': 'F: Welche Zahlungsmethoden werden akzeptiert?',
        'a4': 'A: Grant Union akzeptiert Bitcoin und USDT für alle Transaktionen und gewährleistet schnelle, sichere und weltweite Erreichbarkeit.',
        'q5': 'F: Wie viel kann ich mit Referrals verdienen?',
        'a5': 'A: Es gibt keine Grenze für Referral-Verdienste. Sie verdienen 10% von jeder Einzahlung, die von jemandem getätigt wird, der sich mit Ihrem eindeutigen Referral-Link anmeldet. Je mehr Referrals Sie machen, desto mehr verdienen Sie.',
        'q6': 'F: Wie lange dauert eine Auszahlung?',
        'a6': 'A: Auszahlungen werden innerhalb von Minuten bearbeitet. Bitcoin- und USDT-Transfers werden in der Regel innerhalb von 24 Stunden auf der Blockchain bestätigt.',
        'q7': 'F: Ist meine Investition sicher?',
        'a7': 'A: Ja. Grant Union setzt Sicherheitsmaßnahmen auf Industrieniveau ein und unser professionelles Traderteam stellt sicher, dass Ihre Gelder sorgfältig und fachgerecht verwaltet werden.'
    }
}

print("Script created successfully. Update ready for deployment.")
print("Supported languages:", list(sections.keys()))
