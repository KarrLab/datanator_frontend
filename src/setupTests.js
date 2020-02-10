import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.URL.createObjectURL = function() {};

// setup Enzyme
configure({ adapter: new Adapter() });