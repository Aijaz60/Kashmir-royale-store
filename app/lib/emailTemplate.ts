export function emailTemplate({
  title,
  customerName,
  message,
  status,
  total,
}: {
  title: string;
  customerName: string;
  message: string;
  status: string;
  total: number;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
margin:30px 0;
border-radius:12px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.08);
">

<tr>
<td
style="
background:#111;
padding:30px;
text-align:center;
"
>

<h1
style="
color:#D4AF37;
margin:0;
font-size:34px;
"
>
Kashmir Royale
</h1>

<p
style="
color:#fff;
margin-top:10px;
font-size:15px;
"
>
Luxury Shawls • Premium Pashmina • Elegant Suits
</p>

</td>
</tr>

<tr>

<td style="padding:40px;">

<h2 style="margin-top:0;">
${title}
</h2>

<p>
Hello
<b>${customerName}</b>,
</p>

<p>
${message}
</p>

<hr>

<table width="100%">

<tr>

<td><b>Status</b></td>

<td style="text-align:right;">
${status}
</td>

</tr>

<tr>

<td><b>Total Amount</b></td>

<td
style="
text-align:right;
font-weight:bold;
color:#B8860B;
"
>
₹${total}
</td>

</tr>

</table>

<hr>

<p>
Thank you for choosing
<b>Kashmir Royale</b>.
</p>

<p>
We truly appreciate your trust in our handcrafted collection.
</p>

</td>

</tr>

<tr>

<td
style="
background:#111;
color:#ccc;
padding:25px;
text-align:center;
font-size:13px;
"
>

Kashmir Royale

<br>

Authentic Kashmiri Shawls • Since 1995

<br><br>

Thank you for shopping with us ❤️

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
}