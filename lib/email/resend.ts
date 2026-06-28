import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendQuoteNotification(data: {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  area?: string | null;
  property_type?: string | null;
  surface_area?: string | null;
  address?: string | null;
  message?: string | null;
}) {
  const resend = getResend();
  const to = process.env.QUOTE_NOTIFY_TO || "sharon@pressure-it.co.za";
  const from = process.env.QUOTE_FROM_EMAIL || "quotes@pressure-it.co.za";

  const subject = `New quote request — ${data.name}${data.service ? ` (${data.service})` : ""}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#fff;padding:32px;border-radius:12px;">
      <h1 style="color:#FDE500;font-size:24px;margin-bottom:24px;">New Quote Request</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;">Name</td><td style="padding:8px 0;color:#fff;"><strong>${data.name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#999;">Phone</td><td style="padding:8px 0;"><a href="tel:${data.phone}" style="color:#FDE500;">${data.phone}</a></td></tr>
        ${data.email ? `<tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#FDE500;">${data.email}</a></td></tr>` : ""}
        ${data.service ? `<tr><td style="padding:8px 0;color:#999;">Service</td><td style="padding:8px 0;color:#fff;">${data.service}</td></tr>` : ""}
        ${data.area ? `<tr><td style="padding:8px 0;color:#999;">Area</td><td style="padding:8px 0;color:#fff;">${data.area}</td></tr>` : ""}
        ${data.property_type ? `<tr><td style="padding:8px 0;color:#999;">Property Type</td><td style="padding:8px 0;color:#fff;">${data.property_type}</td></tr>` : ""}
        ${data.surface_area ? `<tr><td style="padding:8px 0;color:#999;">Surface Area</td><td style="padding:8px 0;color:#fff;">${data.surface_area}</td></tr>` : ""}
        ${data.address ? `<tr><td style="padding:8px 0;color:#999;">Address</td><td style="padding:8px 0;color:#fff;">${data.address}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding:8px 0;color:#999;">Message</td><td style="padding:8px 0;color:#fff;">${data.message}</td></tr>` : ""}
      </table>
      <div style="margin-top:24px;">
        <a href="tel:${data.phone}" style="display:inline-block;background:#FDE500;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Call ${data.name}</a>
        <a href="https://wa.me/${data.phone.replace(/\D/g, "")}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-left:12px;">WhatsApp</a>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `Pressure-It Quotes <${from}>`,
    to: [to],
    subject,
    html,
  });
}

export async function sendQuoteAcknowledgement(data: {
  email: string;
  name: string;
}) {
  const resend = getResend();
  const from = process.env.QUOTE_FROM_EMAIL || "quotes@pressure-it.co.za";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#fff;padding:32px;border-radius:12px;">
      <h1 style="color:#FDE500;font-size:24px;margin-bottom:16px;">Thanks, ${data.name}!</h1>
      <p style="color:#ccc;line-height:1.6;">We've received your quote request and will be in touch shortly.</p>
      <p style="color:#ccc;line-height:1.6;">In the meantime, feel free to reach us directly:</p>
      <ul style="color:#ccc;line-height:1.8;padding-left:20px;">
        <li>Phone: <a href="tel:0748518879" style="color:#FDE500;">074 851 8879</a></li>
        <li>WhatsApp: <a href="https://wa.me/27748518879" style="color:#FDE500;">Send a message</a></li>
        <li>Email: <a href="mailto:sharon@pressure-it.co.za" style="color:#FDE500;">sharon@pressure-it.co.za</a></li>
      </ul>
      <p style="color:#666;font-size:14px;margin-top:24px;">PRESSURE-IT — Restore. Protect. Transform.<br/>Premium Property Care since 2010</p>
    </div>
  `;

  await resend.emails.send({
    from: `Pressure-It <${from}>`,
    to: [data.email],
    subject: "We've got your quote request — Pressure-It",
    html,
  });
}
