import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';
import sendEmail from './sendEmail';


const FORM_STEPS = [
  { id: 1, title: 'Ulykkesinfo', description: 'Dato og hendelsesforløp' },
  { id: 2, title: 'Personinfo', description: 'Informasjon om skadede personer' },
  { id: 3, title: 'Virksomhetsinfo', description: 'Arbeidsgiverinfo og involverte' },
  { id: 4, title: 'Ulykkessted', description: 'Hvor skjedde ulykken' },
  { id: 5, title: 'Bekreftelse', description: 'Gjennomgang og innsending' }
];

const AccidentReportForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [personInfo, setPersonInfo] = useState([
    { fullName: '', citizenship: '', birthNumber: '', dNumber: '', deceased: false }
  ]);
  const [companyInfo, setCompanyInfo] = useState({
    mainUnitName: '',
    mainUnitOrgNumber: '',
    subUnitName: '',
    subUnitOrgNumber: '',
    subUnitAddress: '',
    subUnitPhone: ''
  });
  const [involvedCompanies, setInvolvedCompanies] = useState([
    { name: '', orgNumber: '' }
  ]);
  const [accidentInfo, setAccidentInfo] = useState({
    date: '',
    time: '',
    address: '',
    county: '',
    abroad: '',
    accidentDescription: ''
  });
  const maxLength = 3000;

  const handlePersonInfoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    const newPersonInfo = [...personInfo];
    newPersonInfo[index][name] = newValue;
    setPersonInfo(newPersonInfo);
  };

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value
    });
  };

  const handleInvolvedCompaniesChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInvolvedCompanies = [...involvedCompanies];
    newInvolvedCompanies[index][name] = value;
    setInvolvedCompanies(newInvolvedCompanies);
  };

  const addPersonInfo = () => {
    setPersonInfo([...personInfo, { fullName: '', citizenship: '', birthNumber: '', dNumber: '', deceased: false }]);
  };

  const addInvolvedCompany = () => {
    setInvolvedCompanies([...involvedCompanies, { name: '', orgNumber: '' }]);
  };

  const handleAccidentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccidentInfo({
      ...accidentInfo,
      [name]: value
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Melding om arbeidsulykke', 10, 10);
    doc.text(`Dato for ulykken: ${accidentInfo.date}`, 10, 20);
    doc.text(`Tidspunkt for ulykken: ${accidentInfo.time}`, 10, 30);
    doc.text(`Beskrivelse av hendelsen: ${description}`, 10, 40);
    doc.text('Skadede personer:', 10, 50);
    personInfo.forEach((person, index) => {
      doc.text(`Person ${index + 1}:`, 10, 60 + (index * 20));
      doc.text(`Navn: ${person.fullName}`, 10, 65 + (index * 20));
      doc.text(`Statsborgerskap: ${person.citizenship}`, 10, 70 + (index * 20));
      doc.text(`Fødselsnummer: ${person.birthNumber}`, 10, 75 + (index * 20));
      doc.text(`D-nummer: ${person.dNumber}`, 10, 80 + (index * 20));
      doc.text(`Omkom: ${person.deceased ? 'Ja' : 'Nei'}`, 10, 85 + (index * 20));
    });
    doc.text('Virksomhetsinfo:', 10, 100);
    doc.text(`Hovedenhet: ${companyInfo.mainUnitName}`, 10, 110);
    doc.text(`Org. nr. (hovedenhet): ${companyInfo.mainUnitOrgNumber}`, 10, 120);
    doc.text(`Underenhet: ${companyInfo.subUnitName}`, 10, 130);
    doc.text(`Org. nr. (underenhet): ${companyInfo.subUnitOrgNumber}`, 10, 140);
    doc.text(`Adresse (underenhet): ${companyInfo.subUnitAddress}`, 10, 150);
    doc.text(`Telefon (underenhet): ${companyInfo.subUnitPhone}`, 10, 160);
    doc.text('Andre involverte virksomheter:', 10, 170);
    involvedCompanies.forEach((company, index) => {
      doc.text(`Virksomhet ${index + 1}:`, 10, 180 + (index * 20));
      doc.text(`Navn: ${company.name}`, 10, 185 + (index * 20));
      doc.text(`Org. nr.: ${company.orgNumber}`, 10, 190 + (index * 20));
    });
    doc.text('Ulykkessted:', 10, 210);
    doc.text(`Adresse: ${accidentInfo.address}`, 10, 220);
    doc.text(`Fylke: ${accidentInfo.county}`, 10, 230);
    doc.text(`Utenlands: ${accidentInfo.abroad}`, 10, 240);
    doc.text(`Beskrivelse: ${accidentInfo.accidentDescription}`, 10, 250);
    doc.save('melding_om_arbeidsulykke.pdf');
  };

  const sendEmail = () => {
    const templateParams = {
      to_email: 'nett247h@yahoo.com',
      from_name: 'Arbeidstilsynet',
      message: 'Vennligst se vedlagt PDF for melding om arbeidsulykke.'
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });
  };

  const handleSubmit = () => {
    generatePDF();
    sendEmail();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setDescription('');
    setPersonInfo([{ fullName: '', citizenship: '', birthNumber: '', dNumber: '', deceased: false }]);
    setCompanyInfo({ mainUnitName: '', mainUnitOrgNumber: '', subUnitName: '', subUnitOrgNumber: '', subUnitAddress: '', subUnitPhone: '' });
    setInvolvedCompanies([{ name: '', orgNumber: '' }]);
    setAccidentInfo({ date: '', time: '', address: '', county: '', abroad: '', accidentDescription: '' });
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#007C84',
          padding: '1.5rem',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: 'white',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#007C84'
            }}>
              A
            </div>
            <div>
              <h1 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: 0
              }}>
                Melding om arbeidsulykke
              </h1>
              <p style={{
                color: 'white',
                fontSize: '0.875rem',
                margin: '0.25rem 0 0 0'
              }}>
                med alvorlig personskade eller dødsfall
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {FORM_STEPS.map((step, index) => (
              <div key={step.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: index < FORM_STEPS.length - 1 ? '20%' : 'auto'
              }}>
                {/* Progress line */}
                {index < FORM_STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: `${(index * 20) + 10}%`,
                    right: `${100 - ((index + 1) * 20) - 10}%`,
                    top: '12px',
                    height: '2px',
                    backgroundColor: currentStep > step.id ? '#007C84' : '#E5E7EB',
                    zIndex: 0
                  }} />
                )}

                {/* Step circle */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === step.id ? '#007C84' :
                                 currentStep > step.id ? '#007C84' : '#E5E7EB',
                  color: currentStep >= step.id ? 'white' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  zIndex: 1,
                  position: 'relative'
                }}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>

                {/* Step title and description */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    display: window.innerWidth > 640 ? 'block' : 'none'
                  }}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <form>
            {currentStep === 1 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Dato for ulykken
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={accidentInfo.date}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Tidspunkt for ulykken
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={accidentInfo.time}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Beskrivelse av hendelsen
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= maxLength) {
                        setDescription(e.target.value);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      minHeight: '150px',
                      resize: 'vertical'
                    }}
                    placeholder="Beskriv hendelsesforløpet og alvorlighetsgraden..."
                  />
                  <div style={{
                    fontSize: '0.875rem',
                    color: description.length >= maxLength ? '#DC2626' : '#6B7280',
                    textAlign: 'right',
                    marginTop: '0.25rem'
                  }}>
                    {description.length} / {maxLength} tegn
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                {personInfo.map((person, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <h3>Skadet person {index + 1}</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        Fullt navn
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={person.fullName}
                        onChange={(e) => handlePersonInfoChange(index, e)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        Statsborgerskap
                      </label>
                      <input
                        type="text"
                        name="citizenship"
                        value={person.citizenship}
                        onChange={(e) => handlePersonInfoChange(index, e)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        Fødselsnummer (11 siffer)
                      </label>
                      <input
                        type="text"
                        name="birthNumber"
                        value={person.birthNumber}
                        onChange={(e) => handlePersonInfoChange(index, e)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        D-nummer (for utenlandsk arbeidstaker uten fødselsnummer)
                      </label>
                      <input
                        type="text"
                        name="dNumber"
                        value={person.dNumber}
                        onChange={(e) => handlePersonInfoChange(index, e)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        Omkom den skadde personen?
                      </label>
                      <input
                        type="checkbox"
                        name="deceased"
                        checked={person.deceased}
                        onChange={(e) => handlePersonInfoChange(index, e)}
                        style={{
                          marginRight: '0.5rem'
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPersonInfo}
                  style={{
                    backgroundColor: '#007C84',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: '1.5rem'
                  }}
                >
                  Legg til skadet person
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Navn på hovedenhet
                  </label>
                  <input
                    type="text"
                    name="mainUnitName"
                    value={companyInfo.mainUnitName}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Organisasjonsnummer (hovedenhet)
                  </label>
                  <input
                    type="text"
                    name="mainUnitOrgNumber"
                    value={companyInfo.mainUnitOrgNumber}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Navn på underenhet
                  </label>
                  <input
                    type="text"
                    name="subUnitName"
                    value={companyInfo.subUnitName}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Organisasjonsnummer (underenhet)
                  </label>
                  <input
                    type="text"
                    name="subUnitOrgNumber"
                    value={companyInfo.subUnitOrgNumber}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Adresse til underenhet
                  </label>
                  <input
                    type="text"
                    name="subUnitAddress"
                    value={companyInfo.subUnitAddress}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Telefonnummer (underenhet)
                  </label>
                  <input
                    type="text"
                    name="subUnitPhone"
                    value={companyInfo.subUnitPhone}
                    onChange={handleCompanyInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div>
                  <h3>Andre involverte virksomheter</h3>
                  {involvedCompanies.map((company, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                          display: 'block',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          color: '#374151'
                        }}>
                          Navn på virksomheten (underenhet)
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={company.name}
                          onChange={(e) => handleInvolvedCompaniesChange(index, e)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                          display: 'block',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          color: '#374151'
                        }}>
                          Organisasjonsnummer (underenhet)
                        </label>
                        <input
                          type="text"
                          name="orgNumber"
                          value={company.orgNumber}
                          onChange={(e) => handleInvolvedCompaniesChange(index, e)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInvolvedCompany}
                    style={{
                      backgroundColor: '#007C84',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginBottom: '1.5rem'
                    }}
                  >
                    Legg til involvert virksomhet
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={accidentInfo.address}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    I hvilket fylke skjedde ulykken?
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={accidentInfo.county}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Skjedde ulykken i utlandet?
                  </label>
                  <select
                    name="abroad"
                    value={accidentInfo.abroad}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Velg</option>
                    <option value="Ja">Ja</option>
                    <option value="Nei">Nei</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Nærmere beskrivelse av ulykkesstedet
                  </label>
                  <textarea
                    name="accidentDescription"
                    value={accidentInfo.accidentDescription}
                    onChange={handleAccidentInfoChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      minHeight: '150px',
                      resize: 'vertical'
                    }}
                    placeholder="Beskriv ulykkesstedet..."
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2>Bekreftelse</h2>
                <p>Vennligst gjennomgå informasjonen under før du sender inn meldingen.</p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3>Ulykkesinfo</h3>
                  <p><strong>Dato for ulykken:</strong> {accidentInfo.date}</p>
                  <p><strong>Tidspunkt for ulykken:</strong> {accidentInfo.time}</p>
                  <p><strong>Beskrivelse av hendelsen:</strong> {description}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3>Personinfo</h3>
                  {personInfo.map((person, index) => (
                    <div key={index}>
                      <h4>Skadet person {index + 1}</h4>
                      <p><strong>Fullt navn:</strong> {person.fullName}</p>
                      <p><strong>Statsborgerskap:</strong> {person.citizenship}</p>
                      <p><strong>Fødselsnummer:</strong> {person.birthNumber}</p>
                      <p><strong>D-nummer:</strong> {person.dNumber}</p>
                      <p><strong>Omkom:</strong> {person.deceased ? 'Ja' : 'Nei'}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3>Virksomhetsinfo</h3>
                  <p><strong>Hovedenhet:</strong> {companyInfo.mainUnitName}</p>
                  <p><strong>Org. nr. (hovedenhet):</strong> {companyInfo.mainUnitOrgNumber}</p>
                  <p><strong>Underenhet:</strong> {companyInfo.subUnitName}</p>
                  <p><strong>Org. nr. (underenhet):</strong> {companyInfo.subUnitOrgNumber}</p>
                  <p><strong>Adresse (underenhet):</strong> {companyInfo.subUnitAddress}</p>
                  <p><strong>Telefon (underenhet):</strong> {companyInfo.subUnitPhone}</p>

                  <h4>Andre involverte virksomheter</h4>
                  {involvedCompanies.map((company, index) => (
                    <div key={index}>
                      <p><strong>Navn:</strong> {company.name}</p>
                      <p><strong>Org. nr.:</strong> {company.orgNumber}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3>Ulykkessted</h3>
                  <p><strong>Adresse:</strong> {accidentInfo.address}</p>
                  <p><strong>Fylke:</strong> {accidentInfo.county}</p>
                  <p><strong>Utenlands:</strong> {accidentInfo.abroad}</p>
                  <p><strong>Beskrivelse:</strong> {accidentInfo.accidentDescription}</p>
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2rem'
            }}>
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: '1px solid #D1D5DB',
                  fontWeight: '500',
                  cursor: 'pointer',
                  visibility: currentStep === 1 ? 'hidden' : 'visible'
                }}
              >
                Forrige
              </button>
              <button
                type="button"
                onClick={() => currentStep === 5 ? handleSubmit() : setCurrentStep(Math.min(5, currentStep + 1))}
                style={{
                  backgroundColor: '#007C84',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {currentStep === 5 ? 'Send inn' : 'Neste'}
              </button>
            </div>

            <button
              type="button"
              onClick={resetForm}
              style={{
                backgroundColor: '#DC2626',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '1rem',
                width: '100%'
              }}
            >
              Nullstill skjema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccidentReportForm;
