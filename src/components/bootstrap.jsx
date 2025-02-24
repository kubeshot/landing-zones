import React, { useState } from 'react';

const Bootstrap = () => {

  const [githubAccessToken, setGithubAccessToken] = useState('');

  const [formData, setFormData] = useState({
    orgId: '',
    billingAccount: '',
    billingProject: '',
    emailDomain: '',
    parentFolderID: '',
    gitOrgName: '',
    bootstrapRepo: '',
    organizationRepo: '',
    enviornmentsRepo: '',
    networksRepo: '',
    projectsRepo: ''
  });

  const fields = [
    { label: 'Organization ID', name: 'orgId', required: true },
    { label: 'Billing Account', name: 'billingAccount', required: true },
    { label: 'Billing Project', name: 'billingProject', required: true },
    { label: 'Email Domain', name: 'emailDomain', required: true },
    { label: 'Parent Folder ID', name: 'parentFolderID', required: true },
    { label: 'Github Organization Name', name: 'gitOrgName', required: true },
    { label: 'Bootstrap Repository Name', name: 'bootstrapRepo', required: true },
    { label: 'Organization Repository Name', name: 'organizationRepo', required: true },
    { label: 'Environments Repository Name', name: 'enviornmentsRepo', required: true },
    { label: 'Networks Repository Name', name: 'networksRepo', required: true },
    { label: 'Projects Repository Name', name: 'projectsRepo', required: true }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTokenChange = (e) => {
    setGithubAccessToken(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('GitHub Access Token:', githubAccessToken);

  };

  return (
    <div>
      <strong>Step 1: Bootstrap</strong>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label>
              {field.label}:
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
              />
            </label>
          </div>
        ))}
        
        <div>
          <label>
            GitHub Access Token:
            <input
              type="text"
              value={githubAccessToken}
              onChange={handleTokenChange}
              required
            />
          </label>
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Bootstrap;
