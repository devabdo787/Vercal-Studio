export default async function handler(req, res) {
    const { code } = req.query;
    if (!code) return res.redirect('/adminpanel.html');

    try {
        // 1. تبادل "الكود" بـ "توكن" من ديسكورد باستخدام الأسرار المخفية في Vercel
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `https://${req.headers.host}/api/auth`,
                scope: 'identify guilds.members.read',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) throw new Error('Failed to get access token');

        // 2. معرفة ID الشخص الذي سجل دخوله
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        // 3. التأكد من رتبته داخل سيرفرك المحدد (GUILD_ID)
        const memberRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${userData.id}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        });
        const memberData = await memberRes.json();

        // 4. هل يملك الرتبة (ADMIN_ROLE_ID)؟
        if (memberData.roles && memberData.roles.includes(process.env.ADMIN_ROLE_ID)) {
            // نجاح التحقق! نرسله للوحة الإدارة
            res.redirect('/adminpanel.html?auth=success');
        } else {
            res.status(403).send("عذراً، أنت لست أدمن في السيرفر! لا يمكنك الدخول.");
        }
    } catch (e) {
        res.status(500).send("حدث خطأ أثناء التحقق: " + e.message);
    }
}
