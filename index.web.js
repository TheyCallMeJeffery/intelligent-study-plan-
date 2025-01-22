import { AppRegistry } from 'react-native';
import App from './App'; 
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById('root') || document.createElement('div');
if (!rootTag.id) {
  rootTag.id = 'root';
  document.body.appendChild(rootTag);
}

AppRegistry.runApplication(appName, { initialProps: {}, rootTag });
