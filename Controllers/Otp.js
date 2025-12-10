const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../model/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER, 
    pass: process.env.PASS, 
  },
});

const sendOtp = async (req, res) => {
  try {
    const { email,Device } = req.body;
    console.log(email)
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email:'suleiman20015kaita@gmail.com'}).collation({strength:2,locale:'en'}).exec();
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    user.isotp = {
      otp,
      expireresAt: expiresAt,
    };
    await user.save();
    console.log(process.env.USER)
      const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress || 
    req.socket?.remoteAddress ||
    req.ip;


    const msp=await transporter.sendMail({
      from:process.env.USER,
      to: email,
      subject: "Booking App OTP Verification Code",
      // text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html:`
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking App - Secure Access</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style type="text/css">
        /* Client-specific resets */
        body, html { margin: 0; padding: 0; min-height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; width: 100% !important; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td, th { padding: 0; }
        p { margin: 0; padding: 0; }
        img { display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { text-decoration: none; color: inherit; }

        /* Main Styles */
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #eef2f6; /* Lighter background for the entire page */
            color: #4a4a4a;
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            background-color: #eef2f6;
            padding: 20px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); /* Softer, more prominent shadow */
            overflow: hidden;
        }

        .header {
            background: linear-gradient(to right, #2a3e74, #1a2a5e); /* Darker blue gradient */
            color: #ffffff;
            text-align: left; /* Aligned left now */
            padding: 25px 40px;
            display: flex; /* For logo and text alignment */
            align-items: center;
        }

        .header .logo {
            max-width: 60px; /* Slightly smaller logo in header */
            height: auto;
            margin-right: 20px;
            border-radius: 8px; /* Slight roundness to logo if it's square */
        }

        .header h1 {
            margin: 0;
            font-size: 26px; /* Slightly larger heading */
            font-weight: 700;
        }

        .header p {
            margin: 5px 0 0;
            font-size: 15px;
            opacity: 0.9;
        }

        .content {
            padding: 30px 40px;
            color: #4a4a4a;
        }

        .content h3 {
            color: #2a3e74; /* Darker blue for subheadings */
            border-bottom: 1px solid #e9e9e9;
            padding-bottom: 10px;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 19px;
            font-weight: 700;
        }

        .otp-box {
            background-color: #e6f2ff; /* Very light blue background */
            border: 2px solid #1f93ff; /* Matching the logo blue */
            font-size: 40px;
            font-weight: 700;
            text-align: center;
            padding: 25px 15px;
            border-radius: 10px;
            margin: 30px 0;
            letter-spacing: 8px; /* Wider letter spacing */
            color: #1f93ff;
            font-family: 'Courier New', monospace; /* Clearly monospace */
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); /* Soft shadow for depth */
        }

        .otp-message {
            text-align: center;
            font-size: 15px;
            color: #555555;
            margin-bottom: 20px;
        }

        .otp-message strong {
            color: #1a2a5e; /* Stronger color for emphasis */
            font-weight: 700;
        }

        .detail-table {
            width: 100%;
            background-color: #f7fafd; /* Light blueish background for details */
            border-radius: 8px;
            padding: 15px 20px;
            margin-top: 25px;
            margin-bottom: 25px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); /* Inner shadow for subtle depth */
        }

        .detail-row td {
            padding: 10px 0;
            border-bottom: 1px solid #e0e6ed; /* Subtle separator */
        }

        .detail-row:last-child td {
            border-bottom: none;
        }

        .detail-label {
            font-size: 14px;
            font-weight: 700;
            color: #6a6a6a;
            width: 40%;
            white-space: nowrap; /* Prevent label wrapping */
        }

        .detail-value {
            font-size: 14px;
            text-align: right;
            width: 60%;
            color: #5a5a5a;
        }

        .footer {
            background-color: #e9eff4; /* Slightly darker than page background */
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #8899aa; /* Softer footer text color */
            border-top: 1px solid #dcdfe4;
        }

        /* Responsive Media Queries */
        @media screen and (max-width: 620px) {
            .email-wrapper {
                padding: 0 !important;
            }
            .container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
            }
            .header {
                padding: 20px 25px !important;
                flex-direction: column; /* Stack logo and text on small screens */
                text-align: center !important;
            }
            .header .logo {
                margin: 0 auto 15px !important; /* Center logo */
            }
            .header h1 {
                font-size: 22px !important;
            }
            .header p {
                font-size: 14px !important;
            }
            .content {
                padding: 25px !important;
            }
            .otp-box {
                font-size: 32px !important;
                padding: 20px 10px !important;
                letter-spacing: 5px !important;
            }
            .detail-label, .detail-value {
                font-size: 13px !important;
                
            }
            .detail-table {
                padding: 10px 15px !important;
            }
            .footer {
                padding: 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; width: 100% !important; font-family: 'Roboto', Arial, sans-serif; background-color: #eef2f6; color: #4a4a4a; line-height: 1.6;">

    <div class="email-wrapper" style="width: 100%; background-color: #eef2f6; padding: 20px 0;">
        <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" class="container" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <tr>
                <td>
                    <div class="header" style="background: linear-gradient(to right, #2a3e74, #1a2a5e); color: #ffffff; text-align: left; padding: 25px 40px; display: flex; align-items: center;">
                        <img src="http://localhost:3000/img/1764496169702Gemini_Generated_Image_68my3o68my3o68my.png" alt="Booking App Logo" class="logo" width="60" style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 60px; height: auto; margin-right: 20px; border-radius: 8px;">
                        <div style="flex-grow: 1;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Booking App</h1>
                            <p style="margin: 5px 0 0; font-size: 15px; opacity: 0.9;">Secure Access Verification</p>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="content" style="padding: 30px 40px; color: #4a4a4a;">
                        <p style="margin-top: 0; margin-bottom: 15px;">Hello,</p>
                        <p style="margin-bottom: 25px;">
                            We've received a request to verify your account login on Booking App**. To complete this verification, please use the One-Time Password (OTP) provided below:
                        </p>

                        <div class="otp-box" style="background-color: #e6f2ff; border: 2px solid #1f93ff; font-size: 40px; font-weight: 700; text-align: center; padding: 25px 15px; border-radius: 10px; margin: 30px 0; letter-spacing: 8px; color: #1f93ff; font-family: 'Courier New', monospace; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <strong>${otp}</strong>
                        </div>

                        <p class="otp-message" style="margin: 0 0 20px; text-align: center; font-size: 15px; color: #555555;">
                            This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone for your security.
                        </p>

                        <h3 style="color: #2a3e74; border-bottom: 1px solid #e9e9e9; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px; font-size: 19px; font-weight: 700;">Login Attempt Details</h3>

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="detail-table" style=" border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7fafd; border-radius: 8px; padding: 15px 20px; margin-top: 25px; margin-bottom: 25px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                            <tr>
                                <td colspan="2" style="padding: 10px;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; ">
                                        <tr class="detail-row">
                                            <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; font-weight: 700; color: #6a6a6a; width: 40%; white-space: nowrap;">Device Name:</td>
                                            <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; text-align: right; width: 60%; color: #5a5a5a;">${Device?.deviceName}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; font-weight: 700; color: #6a6a6a; width: 40%; white-space: nowrap;">OS Version:</td>
                                            <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; text-align: right; width: 60%; color: #5a5a5a;">${Device?.osName}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; font-weight: 700; color: #6a6a6a; width: 40%; white-space: nowrap;">Device Type:</td>
                                            <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #e0e6ed; font-size: 14px; text-align: right; width: 60%; color: #5a5a5a;">${Device?.modelName}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label" style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #6a6a6a; width: 40%; white-space: nowrap;">IP Address:</td>
                                            <td class="detail-value" style="padding: 10px 0; font-size: 14px; text-align: right; width: 60%; color: #5a5a5a;">${ip}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <p style="margin-bottom: 15px;">
                            If you did not attempt to log in or recognize this activity, please secure your account immediately and reset your password Do not share this OTP with anyone.
                        </p>
                        <p style="margin-bottom: 0;">Thank you for choosing Booking App. Your safety is our top priority.</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div id="copy" class="footer" style="background-color: #e9eff4; text-align: center; padding: 20px; font-size: 12px; color: #8899aa; border-top: 1px solid #dcdfe4;">
                        &copy; ${new Date().getFullYear()} Booking App – All Rights Reserved.
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
      `


    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(otp,email)
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.isotp ||
      !user.isotp.otp ||
      !user.isotp.expireresAt ||
      user.isotp.expireresAt < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (parseInt(otp) !== user.isotp.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    user.isotp = { otp: null, expireresAt: null };
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "OTP verification failed." });
  }
};

 const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(req.body)
    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await newPassword;
    user.password = hashed;
    await user.save();

   res.status(200).json({
  success: true,
  message: "OTP sent successfully."
});

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
};


module.exports={sendOtp,resetPassword,verifyOtp}