import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { supabaseAuth } from '../database/supabaseUtils';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    const [verifyState, setVerifyState] = useState('Default'); // Default | verifying | verified
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);

    useEffect(() => {
        // Check if we have a valid session for password reset
        const checkSession = async () => {
            const { data, error } = await supabaseAuth.getSession();
            if (error || !data.session) {
                setErrMsg('Invalid or expired password reset link. Please request a new one.');
                return;
            }
            setIsValidSession(true);
        };

        checkSession();
    }, []);

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

    async function handleResetPassword(e) {
        e.preventDefault();

        if (!password) {
            setErrMsg('Please enter a new password');
            clearMessages();
            return;
        }

        if (password.length < 6) {
            setErrMsg('Password must be at least 6 characters long');
            clearMessages();
            return;
        }

        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
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
            const { error } = await supabaseAuth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setSuccessMsg('Password has been successfully reset! You can now sign in with your new password.');

            // Redirect to signin page after 3 seconds
            setTimeout(() => {
                router.push('/signin');
            }, 3000);

        } catch (error) {
            console.error('Password reset error:', error);
            setErrMsg(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
            clearMessages();
        }
    }

    if (!isValidSession && !errMsg) {
        return (
            <div className='signupCntn'>
                <Head>
                    <title>Reset Password</title>
                </Head>
                <div className='rightSide' style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2>Checking reset link...</h2>
                        <i className='icofont-spinner-alt-2' style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}></i>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='signupCntn'>
            <Head>
                <title>Reset Password</title>
                <meta property='og:title' content='Reset Password' />
            </Head>
            <div className='leftSide'>
                <video src='signup_vid2.mp4' autoPlay loop muted />
                <div className='overlay'>
                    <h2>&quot;Look First -<br /> Then Leap.&quot;</h2>
                    <p><span>--</span> Alex Hennold <span>--</span></p>
                </div>
            </div>
            <div className='rightSide'>
                <form onSubmit={handleResetPassword}>
                    <Link href='/' className='topsignuplink'>
                        <Image src='/grantunionLogo.png' alt='Grant Union Investment logo' width={160} height={40} style={{ height: 'auto' }} />
                    </Link>
                    <h1>Set New Password</h1>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '14px' }}>
                        Enter your new password below.
                    </p>
                    <div className='inputcontainer'>
                        <div className='passcntn'>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={passwordShow ? 'text' : 'password'}
                                name='password'
                                placeholder='New Password'
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                            <button type='button' onClick={() => setPasswordShow(p => !p)} disabled={isLoading}>
                                <i className={`icofont-eye-${!passwordShow ? 'alt' : 'blocked'}`}></i>
                            </button>
                        </div>
                        <div className='passcntn'>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type={confirmPasswordShow ? 'text' : 'password'}
                                name='confirmPassword'
                                placeholder='Confirm New Password'
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                            <button type='button' onClick={() => setConfirmPasswordShow(p => !p)} disabled={isLoading}>
                                <i className={`icofont-eye-${!confirmPasswordShow ? 'alt' : 'blocked'}`}></i>
                            </button>
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
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                    <p className='haveanaccount'>Remember your password? <Link href='/signin'>Sign In</Link></p>
                    <p className='haveanaccount'>Need a new reset link? <Link href='/forgot-password'>Forgot Password</Link></p>
                </form>
            </div>
        </div>
    );
}