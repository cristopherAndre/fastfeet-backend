import PropertiesReader from 'properties-reader';
import { resolve } from 'path';

export default {
  props: PropertiesReader(resolve(__dirname, '..', '..', 'app.properties')),
};
