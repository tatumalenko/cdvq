import { KeyValues } from "./form/FormParser";
import { FormField } from "./form/FormParserConfig";

/* eslint-disable max-len */
export default class Constants {

    public static readonly NEWLINE = "\n";

    public static readonly LIST_DELIMITER = ",";

    public static readonly KEY_VALUE_DELIMITER = ":";

    public static readonly INBOX_NAME = "INBOX";

    public static readonly EMAIL_IMAP_USERNAME = process.env.EMAIL_IMAP_USERNAME ?? "";

    public static readonly EMAIL_IMAP_PASSWORD = process.env.EMAIL_IMAP_PASSWORD ?? "";

    public static readonly EMAIL_SMTP_USERNAME = process.env.EMAIL_SMTP_USERNAME ?? "";

    public static readonly EMAIL_SMTP_PASSWORD = process.env.EMAIL_SMTP_PASSWORD ?? "";

    public static readonly EMAIL_FROM = "lettres@droitsdesvapoteurs.ca";

    public static readonly EMAIL_CAMPAIGN_FROM = "people@pushpolitics.net";

    public static readonly EMAIL_SURVEY_FROM = "no-reply@squarespace.info";

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

    public static readonly IMAP_HOST = "imap.gmail.com";

    public static readonly IMAP_PORT = 993;

    public static readonly R4V_SURVEY_FORM_FIELDS: FormField[] = [
        {
            key: "Nom",
            newKey: "input_1.3"
        },
        {
            key: "E-mail",
            newKey: "input_2"
        },
        {
            key: "Âge",
            newKey: "input_4"
        },
        {
            key: "Code postal",
            newKey: "input_5"
        },
        {
            key: "Nombre d'années de vapotage?",
            newKey: "input_8"
        },
        {
            key: "Les saveurs que vous vapotez?",
            newKey: "input_18[]",
            isList: true
        },
        {
            key: "La saveur que vous avez utilisé à l’initiation?",
            newKey: "input_19[]",
            isList: true
        },
        {
            key: "Quel est votre taux de nicotine?",
            newKey: "input_12"
        },
        {
            key: "Quel était votre taux de nicotine à l’initiation?",
            newKey: "input_13"
        },
        {
            key: "Avez-vous réussi un sevrage complet du tabac grâce au vapotage?",
            newKey: "input_14"
        },
        {
            key: "Fumez-vous moins grâce au vapotage?",
            newKey: "input_15"
        },
        {
            key: "Durant la fermeture obligatoire des commerces en raison de la pandémie COVID-19 le mois de mars, avril et mai 2020, comment avez-vous réussi à combler votre dépendance à la nicotine?",
            newKey: "input_20"
        },
        {
            key: "Si le gouvernement interdit tous les saveurs dans les liquides à vapoter à l'exception du tabac, quel serait l'impact sur vous?",
            newKey: "input_21"
        },
        {
            key: "Décharge légale",
            newKey: "input_16.1"
        }
    ];

    public static readonly R4V_SURVEY_FORM_FIELD_NAME_DELIMITER = " ";

    public static readonly R4V_SURVEY_FORM_FIELD_NAME_FIRST_KEY = "input_1.3";

    public static readonly R4V_SURVEY_FORM_FIELD_NAME_LAST_KEY = "input_1.6";

    public static readonly R4V_SURVEY_FORM_FIELDS_OTHER: KeyValues[] = [
        {
            key: "input_17.2",
            value: [ "Non" ]
        },
        {
            key: "is_submit_17",
            value: [ "1" ]
        },
        {
            key: "gform_submit",
            value: [ "17" ]
        }
    ];

    public static readonly R4V_SURVEY_FORM_SUCCESS_MESSAGE = "Merci d'avoir répondu au sondage Droits-Des-Vapoteurs.ca.";
}
