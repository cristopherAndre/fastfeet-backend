import PropertiesReader from 'properties-reader';
import { resolve } from 'path';

const properties = PropertiesReader(
  resolve(__dirname, '..', '..', 'app.properties')
);

export default properties;
