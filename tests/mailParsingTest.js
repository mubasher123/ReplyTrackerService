const html2 = `<div dir="ltr"><div></div><div class="gmail_default" style="font-family:tahoma,sans-serif"><br></div></div><br><div class="gmail_quote"><div dir="ltr" class="gmail_attr">On Sun, 3 Feb 2019 at 00:35, Udit Goenka &lt;<a href="mailto:uditsaas@gmail.com">uditsaas@gmail.com</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex"> <div class="gmail-m_3171190102006446176funnel-container"> <div class="gmail-m_3171190102006446176user-container gmail-m_3171190102006446176redactor-styles"><div><p>Hello <span>Udit</span>, </p>\\r\\n<p>This is the first email that we are sending from FunnelBake to run some tests. I have got your email: <span><a href="mailto:udit@gopbn.com" target="_blank">udit@gopbn.com</a></span> from LinkedIn while I was trying to connect with all my fellow marketers.</p>\\r\\n<p>Best Regards,<br>Udit Goenka<a href="https://staging.emailsilo.xyz/api/track-click/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c41c13a240b05108daff62c/FunnelBake/https%253A%252F%252Ffunnelbake.com" target="_blank"><br>FunnelBake</a></p>\\r\\n<p><span style="font-size:10px">If you don&#39;t want to receive any further emails then please click on the <a href="https://staging.emailsilo.xyz/api/unsubscribe/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c41c13a240b05108daff62c" target="_blank">Unsubscribe</a> link</span></p>\\r\\n</div> </div> <div class="gmail-m_3171190102006446176signature"> <img src="https://staging.emailsilo.xyz/api/track-open/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c41c13a240b05108daff62c" alt="logo"> </div> </div>\\r\\n</blockquote></div>\\r\\n`
const htmlEmail = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css" /> <div class="funnel-container"> <div class="user-container redactor-styles" style="margin: 0; padding: 16px 18px; color: #444950; font-family: "Trebuchet MS","Helvetica Neue",Helvetica,Tahoma,sans-serif; font-size: 1em; line-height: 1.5; box-sizing: border-box;"><html><head></head><body><p>Hello&#xA0;<span data-redactor-type="variable">Udit</span>,&#xA0;</p>\n<p>This is the first email that we are sending from FunnelBake to run some tests. I have got your&#xA0;email:&#xA0;<span data-redactor-type="variable">uditsaas@gmail.com</span> from LinkedIn while I was trying to connect with all my fellow marketers.</p>\n<p>Best Regards,<br>Udit Goenka<a href="https://staging.emailsilo.xyz/api/track-click/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c46e4381194a15ed6a83df1/FunnelBake/https%253A%252F%252Ffunnelbake.com"><br>FunnelBake</a></p>\n<p><span style="font-size: 10px;">If you don&apos;t want to receive any further emails then please click on the&#xA0;<a href="https://staging.emailsilo.xyz/api/unsubscribe/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c46e4381194a15ed6a83df1" target="_blank">Unsubscribe</a>&#xA0;link</span></p>\n</body></html> </div> <div class="signature"> <img src="https://staging.emailsilo.xyz/api/track-open/5c3dac527a03d903fbc2ed42/5c55e8b807d2b8021f4c6c94/5c46e4381194a15ed6a83df1" alt="logo" ><!-- signture link & tracking link --> </div> </div>`
require('dotenv').config();
const _ = require('lodash')
const getUrls = require('get-urls');
const url = require('url');
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const CampaignItems = require('../lib/Infrastructure/DB/CampaignItems');
const SentMails = require('../lib/Infrastructure/DB/SentMails');
const {expect} = require('chai')
const EmailReplyParser = require("email-reply-parser");

const replyMessage = "Hei og takk.\nVi trenger ikke noen hjelp av dere.\n\n\nons. 6. nov. 2019 kl. 14:35 skrev Dan Grandalen <kontakt@10xwebpartner.com>:\n\n> Hei igjen,\n>\n> Først å fremst vil jeg beklage som dukker opp uinvitert i inboksen din,\n> men det er slik vi hjelper nye bedriften utover jungeltelegrafen.\n>\n> I motsetning til oss, kan Salong Eureka anskaffe nye klienter med betalt\n> annonsering målbart og profitabelt (dette fungerer kun for bedrifter som\n> løser et problem for mange)\n>\n> Vi har noen konkrete tips hvordan du kan gjøre dette, hadde det vært\n> interessant å ta en prat?\n>\n>\n> Mvh Nickolas Eek & Dan Grandalen\n> Tlf: 9708 9705 / 410 12346\n> 10xwebpartner.no\n> <https://tracking.emailsilo.xyz/api/track-click/5b49cdffe6c1d9298b42ccbd/5db9420c58e3bf241a8c1ebb/5db806416ef34324de418a6c/10xwebpartner_no/https%253A%252F%252F10xwebpartner.no%252F>\n> [image: logo]\n>\n";




describe('MailDetails DB Service', function () {

  it('should get item by sent mail and recipient', async function () {
    this.timeout(5000)
    /**
     *
     * @type {Set}
     */
    // const urls = getUrls(html2)
    // const openLinks = _.filter(Array.from(urls), x => {return (x.indexOf('track-open') !== -1)})
    // if (openLinks.length) {
    //
    //   const matchRegex = new RegExp('(\\w{24})',"g")
    //   const openLink = openLinks[0];
    //
    //   const parsedOpenLink = url.parse(openLink);
    //   const [teamId, campaignItemId, recipientId] = parsedOpenLink.path.match(matchRegex);
    //
    //   console.log(teamId, campaignItemId, recipientId);
    //
    //   const campaignItem = await CampaignItems.getByCampaignItemId(campaignItemId);
    //   const sentMail = await SentMails.getIDByCampaignItemAndRecipient(campaignItemId, recipientId);
    //
    //   console.log(sentMail);
    //   // next making sure sent Item belongs to current user
    //   console.log(campaignItem);
    //
    //
    //
    // }
    const email =  new EmailReplyParser().read(replyMessage);
    console.log(email.getVisibleText().trim());
  })

})