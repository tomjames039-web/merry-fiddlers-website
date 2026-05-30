import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const diagnostics = {
    resendKeyExists: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // Try to send a test email
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'The Merry Fiddlers <onboarding@resend.dev>',
          to: ['info@themerryfiddlers.co.uk'],
          subject: 'Test Email from The Merry Fiddlers Website',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>✅ Email System Test Successful!</h1>
              <p>This is a test email sent at ${new Date().toISOString()}</p>
              <p>If you're seeing this, your email system is working correctly!</p>
              <hr>
              <p><strong>Diagnostics:</strong></p>
              <ul>
                <li>Resend API Key: Configured ✅</li>
                <li>Environment: ${process.env.NODE_ENV}</li>
                <li>Timestamp: ${new Date().toISOString()}</li>
              </ul>
            </div>
          `,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Test email sent successfully! Check info@themerryfiddlers.co.uk inbox.',
          diagnostics,
          emailResult: result,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send test email',
          diagnostics,
          error: result,
        }, { status: 500 });
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Exception while sending test email',
        diagnostics,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: false,
    message: 'RESEND_API_KEY not configured',
    diagnostics,
  }, { status: 500 });
}
