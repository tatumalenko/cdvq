/* eslint-disable max-len */
export default class Constants {

    public static readonly INBOX_NAME = "INBOX";

    public static readonly EMAIL_USERNAME = process.env.EMAIL_USERNAME ?? "";

    public static readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ?? "";

    public static readonly EMAIL_FROM = "lettres@droitsdesvapoteurs.ca";

    public static readonly EMAIL_SENDER = "CDVQ";

    public static readonly EMAIL_SUBJECT = "Votre lettre a été envoyé à votre député.e!";

    public static readonly EMAIL_BODY = `
<p style="text-align:center;"><img src="https://surveymonkey-assets.s3.amazonaws.com/survey/290388197/3c327bde-2f10-410d-906d-6a83c6d9c32e.png" alt="CDVQ logo" width=316.97479" height="200"></p>
<div style="margin-left: 30px; margin-right: 30px;">
<p style="line-height: 0px;">
<h2 style="line-height: 0px;">Un gros merci!!</h2>
Merci pour votre participation à notre campagne de lettre! Des petits gestes simples comme celui-ci par un grand nombre de personnes ont un impact important. 
<br><br>
<h2 style="line-height: 0px;">Complétez le sondage</h2>
Nos alliés de l'Ontario, <i>Rights4Vapers</i>, ont recueilli plus de 5,000 sondages mais nous avons besoin d'une plus grande participation de la part des vapoteurs et vapoteuses du Québec.
<br><br>
<a style="font-weight: bold;" href="http://droitsdesvapoteurs.ca/sondage">Cliquez ici pour compléter le sondage!</a>
<br><br>
Nous vous invitons également à partager notre <a style="font-weight: bold;" href="http://droitsdesvapoteurs.ca/lettres">campagne de lettre</a> et le <a style="font-weight: bold;" href="http://droitsdesvapoteurs.ca/sondage">sondage</a> avec vos ami.e.s!
<br><br>
<h2 style="line-height: 0px;">Abonnez-vous</h2>
N'oubliez pas de vous abonner à notre <a style="font-weight: bold;" href="https://www.droitsdesvapoteurs.ca/#abonnez-vous">infolettre</a> pour recevoir des nouvelles et mises à jour.
<br><br><br><br><br>
<strong>Coalition des droits des vapoteurs du Québec (CDVQ)</strong>
<br>
www.droitsdesvapoteurs.ca
<br>
info@droitsdesvapoteurs.ca 
<br>
</p>
</div>
`;

    public static readonly SMTP_HOST = "smtp.office365.com";

    public static readonly SMTP_PORT = 587;

    public static readonly IMAP_HOST = "outlook.office365.com";

    public static readonly IMAP_PORT = 993;
}
