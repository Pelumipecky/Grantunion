import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { supabaseAuth } from '../database/supabaseUtils';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verifyState, setVerifyState] = useState('Default'); // Default | verifying | verified
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = () => {
        if (verifyState === 'Default') {
            setVerifyState('verifying');
            setTimeout(() => {
                setVerifyState('verified');
            }, 2000);
        } else {
            setVerifyState('verified');
        }
    };

    function clearMessages() {
        setTimeout(() => {
            setErrMsg('');
            setSuccessMsg('');
        }, 5000);
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        if (!email.trim()) {
            setErrMsg('Please enter your email address');
            clearMessages();
            return;
        }

        if (verifyState !== 'verified') {
            setErrMsg('Please complete the human verification');
            clearMessages();
            return;
        }

        setIsLoading(true);
        setErrMsg('');
        setSuccessMsg('');

        try {
            const { error } = await supabaseAuth.resetPasswordForEmail(email.trim().toLowerCase(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                throw error;
            }

            setSuccessMsg('Password reset link has been sent to your email address. Please check your inbox and follow the instructions.');
            setEmail('');
            setVerifyState('Default');
        } catch (error) {
            console.error('Password reset error:', error);
            setErrMsg(error.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
            clearMessages();
        }
    }

    return (
        <div className='signupCntn'>
            <Head>
                <title>Forgot Password</title>
                <meta property='og:title' content='Forgot Password' />
            </Head>
            <div className='leftSide'>
                <video src='signup_vid2.mp4' autoPlay loop muted />
                <div className='overlay'>
                    <h2>&quot;Look First -<br /> Then Leap.&quot;</h2>
                    <p><span>--</span> Alex Hennold <span>--</span></p>
                </div>
            </div>
            <div className='rightSide'>
                <form onSubmit={handleForgotPassword}>
                    <Link href='/' className='topsignuplink'>
                        <Image src='/grantunionLogo.png' alt='Grant Union Investment logo' width={160} height={40} style={{ height: 'auto' }} />
                    </Link>
                    <h1>Reset Your Password</h1>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '14px' }}>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                    <div className='inputcontainer'>
                        <div className='inputCntn'>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                name='email'
                                placeholder='Email Address'
                                required
                                disabled={isLoading}
                            />
                            <span><i className='icofont-ui-email'></i></span>
                        </div>
                        <div className='_cloudflr_verifcation_widget'>
                            <div className='verification_Box'>
                                <div className='checkbox_cntn' onClick={handleVerify}>
                                    <input type='checkbox' disabled={isLoading} />
                                    {verifyState === 'Default' && <span aria-hidden='true' className='unchecked'></span>}
                                    {verifyState === 'verifying' && <i aria-hidden='true' className='icofont-spinner-alt-2'></i>}
                                    {verifyState === 'verified' && <i aria-hidden='true' className='icofont-check-circled'></i>}
                                </div>
                                <div className='verification_status'>
                                    {verifyState === 'Default' && <p>Human Verification</p>}
                                    {verifyState === 'verifying' && <p>Verifying...</p>}
                                    {verifyState === 'verified' && <p>Verified</p>}
                                </div>
                            </div>
                            <div className='service_provider'>
                                <p>Protected by <Image src='/cloudflare.png' alt='cloudflare' width={120} height={40} style={{ height: 'auto' }} /></p>
                            </div>
                        </div>
                        {errMsg && <p className='errorMsg'>{errMsg}</p>}
                        {successMsg && <p style={{ color: '#28a745', background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '1rem' }}>{successMsg}</p>}
                        <button type='submit' className='fancyBtn' disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                    <p className='haveanaccount'>Remember your password? <Link href='/signin'>Sign In</Link></p>
                    <p className='haveanaccount'>Don&apos;t have an account? <Link href='/signup'>Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}