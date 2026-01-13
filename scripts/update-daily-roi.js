import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to send ROI email notification
async function sendROIEmail(userEmail, userName, investmentPlan, dailyROI, totalCreditedROI, totalExpectedROI) {
  try {
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C0F36;">Daily ROI Credit Notification</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your daily ROI has been credited to your account.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #28a745;">Today's Earnings</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Daily ROI Credited:</strong> $${dailyROI.toFixed(2)}</li>
            <li><strong>Total ROI Credited:</strong> $${totalCreditedROI.toFixed(2)}</li>
            <li><strong>Total Expected ROI:</strong> $${totalExpectedROI.toFixed(2)}</li>
            <li><strong>Investment Plan:</strong> ${investmentPlan}</li>
            <li><strong>Progress:</strong> ${((totalCreditedROI / totalExpectedROI) * 100).toFixed(1)}% complete</li>
          </ul>
        </div>
        <p>Your investment is performing well. Check your dashboard for more details on your portfolio.</p>
        <p>Best regards,<br><strong style="color: #1C0F36;">Grant Union Investment Team</strong></p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userEmail,
        subject: `Daily ROI Credit - $${dailyROI.toFixed(2)} Earned`,
        message: emailMessage,
        type: 'roi_daily_credit'
      })
    });

    if (response.ok) {
      console.log(`📧 ROI email sent to ${userEmail}`);
    } else {
      console.error(`Failed to send ROI email to ${userEmail}`);
    }
  } catch (emailError) {
    console.error('Error sending ROI email:', emailError);
  }
}

// Plan Configuration (Mirrors src/utils/planConfig.js)
const PLANS = {
  "3-Day Plan": { dailyRate: 0.08, duration: 3 },
  "7-Day Plan": { dailyRate: 0.03, duration: 7 },
  "12-Day Plan": { dailyRate: 0.035, duration: 12 },
  "15-Day Plan": { dailyRate: 0.04, duration: 15 },
  "3-Month Plan": { dailyRate: 0.04, duration: 90 },
  "6-Month Plan": { dailyRate: 0.05, duration: 180 }
};

async function updateDailyROI() {
  console.log('Starting Daily ROI Update...');

  try {
    // 1. Fetch all active investments
    const { data: investments, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('status', 'Active');

    if (fetchError) throw fetchError;

    console.log(`Found ${investments.length} active investments.`);

    let updatedCount = 0;
    let completedCount = 0;

    for (const investment of investments) {
      const plan = PLANS[investment.plan];
      
      if (!plan) {
        console.warn(`Unknown plan for investment ${investment.id}: ${investment.plan}`);
        continue;
      }

      // Calculate daily ROI amount
      const capital = parseFloat(investment.capital);
      const dailyAmount = capital * plan.dailyRate;
      
      // Current credited amount
      const currentCredited = parseFloat(investment.credited_roi || 0);
      const totalExpectedROI = parseFloat(investment.roi);

      // Check if investment has reached its full ROI
      if (currentCredited >= totalExpectedROI) {
        // Mark as Completed if not already
        if (investment.status !== 'Completed') {
            await supabase
                .from('investments')
                .update({ status: 'Completed' })
                .eq('id', investment.id);
            completedCount++;
        }
        continue;
      }

      // Calculate new credited amount (cap at total expected ROI)
      let newCredited = currentCredited + dailyAmount;
      if (newCredited > totalExpectedROI) {
        newCredited = totalExpectedROI;
      }

      // Update the investment
      const { error: updateError } = await supabase
        .from('investments')
        .update({ 
          credited_roi: newCredited,
          updated_at: new Date().toISOString()
        })
        .eq('id', investment.id);

      if (updateError) {
        console.error(`Failed to update investment ${investment.id}:`, updateError);
      } else {
        console.log(`Updated investment ${investment.id}: +$${dailyAmount.toFixed(2)} (Total: $${newCredited.toFixed(2)} / $${totalExpectedROI.toFixed(2)})`);
        updatedCount++;

        // Fetch user email and send ROI notification
        try {
          const { data: userData, error: userError } = await supabase
            .from('userlogs')
            .select('email, name')
            .eq('idnum', investment.idnum)
            .single();

          if (!userError && userData && userData.email) {
            await sendROIEmail(
              userData.email,
              userData.name || 'User',
              investment.plan,
              dailyAmount,
              newCredited,
              totalExpectedROI
            );
          }
        } catch (err) {
          console.error(`Error sending email for investment ${investment.id}:`, err);
        }
      }
    }

    console.log('-----------------------------------');
    console.log(`Summary:`);
    console.log(`- Processed: ${investments.length}`);
    console.log(`- ROI Credited: ${updatedCount}`);
    console.log(`- Completed Plans: ${completedCount}`);
    console.log('-----------------------------------');

  } catch (error) {
    console.error('Critical Error:', error);
  }
}

updateDailyROI();
