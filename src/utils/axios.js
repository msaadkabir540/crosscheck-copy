import axios from 'axios';

import { envObject } from '../constants/environmental';

const { API_URL } = envObject;

axios.defaults.baseURL = API_URL;

export default axios;
