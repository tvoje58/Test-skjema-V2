import emailjs from 'emailjs-com';

const sendEmail = async (accidentInfo: any) => {
  const templateParams = {
    to_email: 'nett247h@yahoo.com',
    from_name: 'Test_tilsynet',
    message: 'Vennligst se vedlagt PDF for melding om arbeidsulykke.',
    attachments: [
      {
        name: 'melding_om_arbeidsulykke.pdf',
        data: new Uint8Array(await fetch('C:\Users\voje_t\Downloads').then(res => res.arrayBuffer()))
      }
    ]
  };

  emailjs.send('service_sl5k0nq', 'template_ezwhmts', templateParams, 'SptcYiiRZnl8tH3QD')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
      console.log('FAILED...', err);
    });
};

export default sendEmail;