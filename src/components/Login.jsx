import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password State
    const [showForgot, setShowForgot] = useState(false);
    const [forgotId, setForgotId] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotMsg('');

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: forgotId }),
            });
            const data = await res.json();
            setForgotMsg(data.message || 'If an account exists, a reset link was sent.');
        } catch (err) {
            setForgotMsg('Could not connect to server.');
        } finally {
            setForgotLoading(false);
        }
    };

    // Dynamic Branding
    const [salonName] = useState(() => {
        try { return localStorage.getItem('noorkada_salonName') || "Noorkada POS"; } catch (e) { return "Noorkada POS"; }
    });
    const [salonLogo] = useState(() => {
        try { return localStorage.getItem('noorkada_salonLogo') || "default"; } catch (e) { return "default"; }
    });

    React.useEffect(() => {
        try {
            document.title = salonName || "Noorkada POS";
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            if (salonLogo === 'default') {
                const initial = (salonName ? salonName[0].toUpperCase() : "N");
                link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%232A2118"/><text x="50" y="68" font-size="52" font-family="Outfit, sans-serif" font-weight="bold" fill="%23F5E6C8" text-anchor="middle">${initial}</text></svg>`;
            } else {
                link.href = salonLogo;
            }
        } catch (e) { }
    }, [salonName, salonLogo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch {
            setError('Could not connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FDFAF6', fontFamily: "'Outfit', sans-serif"
        }}>
            <div className="modal-content" style={{
                width: '100%', maxWidth: 400, padding: 40, background: '#FFFFFF',
                borderRadius: 20, border: '1px solid #EDE6D8', boxShadow: '0 4px 24px rgba(44,33,24,.08)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                        width: salonLogo === 'default' ? 50 : 'auto', maxWidth: 160, height: 50, borderRadius: salonLogo === 'default' ? '50%' : '10px', background: salonLogo === 'default' ? 'linear-gradient(145deg,#2A2118,#5A4030)' : 'transparent',
                        margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                    }}>
                        {salonLogo === 'default' ? (
                            <span style={{ fontSize: 22, fontWeight: 700, color: '#F5E6C8' }}>{salonName[0].toUpperCase()}</span>
                        ) : (
                            <img src={salonLogo} alt="Logo" style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        )}
                    </div>
                    <h2 style={{ color: '#2A2118', fontSize: 24, fontWeight: 700 }}>{salonName}</h2>
                    <p style={{ color: '#9A9088', fontSize: 13, marginTop: 5 }}>Please login to continue</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#9A9088', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Username</label>
                        <input
                            type="text"
                            className="inp"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            style={{
                                width: '100%', padding: '12px 15px', borderRadius: 10,
                                border: '1.5px solid #E8E0D4', outline: 'none', background: '#FFFFFF',
                                boxSizing: 'border-box', WebkitBoxShadow: '0 0 0px 1000px #F5F0E8 inset', WebkitTextFillColor: '#2A2118', caretColor: '#2A2118'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label style={{ fontSize: 11, color: '#9A9088', textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
                            <button
                                type="button"
                                onClick={() => setShowForgot(true)}
                                style={{
                                    background: 'none', border: 'none', color: '#B08040', fontSize: 11,
                                    fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: "'Outfit', sans-serif"
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <input
                            type="password"
                            className="inp"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%', padding: '12px 15px', borderRadius: 10,
                                border: '1.5px solid #E8E0D4', outline: 'none', background: '#FFFFFF',
                                boxSizing: 'border-box', WebkitBoxShadow: '0 0 0px 1000px #F5F0E8 inset', WebkitTextFillColor: '#2A2118', caretColor: '#2A2118'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 15px', background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: 8, color: '#991B1B', fontSize: 12, marginBottom: 20, textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '70%', padding: 14, borderRadius: 10, background: 'linear-gradient(135deg,#2A2118,#4A3828)',
                            color: '#FDFAF6', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                            transition: 'all .2s', opacity: loading ? 0.7 : 1, margin: '10px auto 0', display: 'block'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: 25, textAlign: 'center', fontSize: 11, color: '#C4A870', letterSpacing: 1, textTransform: 'uppercase' }}>
                    {salonName || 'Noorkada POS'}
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgot && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(42,33,24,.45)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fi .2s'
                }}>
                    <div className="modal-content" style={{
                        background: '#FDFAF6', padding: 30, borderRadius: 16, width: 340,
                        boxShadow: '0 16px 48px rgba(42,33,24,.25)'
                    }}>
                        <h3 style={{ margin: '0 0 10px', color: '#2A2118', fontSize: 20 }}>Reset Password</h3>
                        <p style={{ margin: '0 0 20px', color: '#7A7068', fontSize: 13, lineHeight: 1.5 }}>
                            Enter your username or email address. If an account is found, a temporary password will be sent to your registered email.
                        </p>

                        <form onSubmit={handleForgotSubmit}>
                            <input
                                type="text"
                                value={forgotId}
                                onChange={e => setForgotId(e.target.value)}
                                placeholder="Username or Email"
                                required
                                style={{
                                    width: '100%', padding: '10px 15px', borderRadius: 8,
                                    border: '1px solid #E8E0D4', marginBottom: 15, outline: 'none',
                                    background: '#FFFFFF', boxSizing: 'border-box', WebkitBoxShadow: '0 0 0px 1000px #F5F0E8 inset', WebkitTextFillColor: '#2A2118', caretColor: '#2A2118'
                                }}
                            />

                            {forgotMsg && (
                                <div style={{ marginBottom: 15, fontSize: 12, color: forgotMsg.includes('sent') ? '#166534' : '#991B1B', background: forgotMsg.includes('sent') ? '#DCFCE7' : '#FEF2F2', padding: 10, borderRadius: 6 }}>
                                    {forgotMsg}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', color: '#7A7068', cursor: 'pointer', fontSize: 13, fontWeight: 500, padding: '8px 16px' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={forgotLoading} style={{ background: '#B08040', color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: forgotLoading ? 0.7 : 1 }}>
                                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
