(process as any).browser = true;

const processEnv = require('dotenv').config();

process.env = {
    ...process.env,
    ...processEnv
};

process.env['NODE_' + 'ENV'] = 'production';

import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/app/app';
import { configureAws } from 'dhd-lib';


configureAws({
    accessKeyId: process.env["REACT_AWS_ACCESS_KEY_ID"],
    secretAccessKey: process.env["REACT_AWS_SECRET_ACCESS_KEY"],
    region: process.env["REACT_AWS_REGION"]
});

ReactDOM.render(<App />, document.getElementById('root'));
